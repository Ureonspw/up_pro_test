import { GoogleGenerativeAI } from "@google/generative-ai";
import styles from '../../../css/chatdiscussion/Chatglobal.module.css';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


interface Message {
  role: string;
  text: string;
}

function formatMessage(text: string): JSX.Element[] {
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const preText = text.substring(lastIndex, match.index);
    if (preText.trim()) {
      parts.push(<p key={lastIndex}>{preText}</p>);
    }

    parts.push(
      <pre key={match.index}><code>{match[2]}</code></pre>
    );
    lastIndex = regex.lastIndex;
  }

  const postText = text.substring(lastIndex);
  if (postText.trim()) {
    parts.push(<p key={lastIndex}>{postText}</p>);
  }

  return parts;
}

function Chatglobal() {
  const genAI = new GoogleGenerativeAI("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U");
  const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  async function handleSendMessage() {
    if (input.length) {
      let chatMessages = [...messages, { role: "user", text: input }, { role: "loader", text: "" }];
      setInput("");
      setMessages(chatMessages);

      try {
        const prompt = `
          Réponds à la question suivante en tant qu'assistant IA généraliste : ${input}.
          Sois précis, concis, et donne des explications claires. Ajoute des exemples si nécessaire.
          Chat history: ${JSON.stringify(messages)}
        `;

        const result = await model.generateContent([prompt]);

        chatMessages = [...chatMessages.filter((msg) => msg.role !== 'loader'), { role: "model", text: result.response.text() }];
        setMessages(chatMessages);
      } catch (error) {
        chatMessages = [...chatMessages.filter((msg) => msg.role !== 'loader'), { role: "error", text: "Erreur lors de l'envoi du message, réessayez plus tard." }];
        setMessages(chatMessages);
        console.error(error);
      }
    }
  }

  return (
    <AuthenticatedLayout>
    <section className={styles.chatWindow}>
      <h2 className={styles.title}>NOK_CHAT</h2>

      {messages.length > 0 && (
        <div className={styles.chat}>
          {messages.map((msg, index) => (
            <div className={styles[msg.role]} key={index}>
              {formatMessage(msg.text)}
            </div>
          ))}
        </div>
      )}

      <div className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Posez votre question ici"
        />
        <button onClick={handleSendMessage}>Envoyer</button>
      </div>
    </section>
    </AuthenticatedLayout>
  );
}

export default Chatglobal;
