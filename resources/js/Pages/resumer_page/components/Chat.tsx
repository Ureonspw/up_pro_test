import { GoogleGenerativeAI } from "@google/generative-ai";
import styles from '../../../../css/resumer_page/component/Chat.module.css';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Message {
  role: string;
  text: string;
}

interface FileProps {
  file: string;
  type: string;
}

interface ChatProps {
  file: FileProps;
  selectedLanguage: 'français' | 'yoruba';
}

function formatMessage(text: string): JSX.Element[] {
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const preText = text.substring(lastIndex, match.index);
    if (preText.trim()) {
      preText.split('\n').forEach((line, i) => {
        parts.push(<p key={lastIndex + i}>{line}</p>);
      });
    }

    parts.push(
      <pre key={match.index}><code>{match[2]}</code></pre>
    );
    lastIndex = regex.lastIndex;
  }

  const postText = text.substring(lastIndex);
  if (postText.trim()) {
    postText.split('\n').forEach((line, i) => {
      parts.push(<p key={lastIndex + i}>{line}</p>);
    });
  }

  return parts;
}

function Chat({ file, selectedLanguage }: ChatProps) {
  const genAI = new GoogleGenerativeAI("AIzaSyBQlEUG_Tpan-EO_PlxXaT_4kWm0ZfVK0U");
  const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  async function handleSendMessage() {
    if (input.length) {
      let chatMessages = [...messages, { role: "user", text: input }, { role: "loader", text: "" }];
      setInput("");
      setMessages(chatMessages);

      try {
        const chatPrompt = selectedLanguage === 'yoruba' ?
          `
          Dahun ìbéèrè yìí lórí àkọ́ọ̀lẹ̀ tí a fi dá e lẹ́lẹ̀ : ${input}.
          Dahun gẹ́gẹ́ bí chatbot pẹ̀lú àwọn ìròyìn kúkurú àti ọ̀rọ̀ nìkan (kò sí àwọn àmì àgbékalẹ̀, àwọn àmì tàbí àwọn àmì àti ohun àtàyébáláà).
          Tí àkọ́ọ̀lẹ̀ náà bá ní kóòdù, fi hàn ní ọ̀nà tó tọ́, pẹ̀lú àwọn ìlà tuntun àti àgbédémọ̀ tó dára. Tún ṣe àgbékalẹ̀ ọ̀rọ̀ náà dáadáa.
          Tí kóòdù bá gùn, fi èdè náà kún un lẹ́yìn àwọn backticks mẹ́ta.
          Ìtàn ìbánisọ̀rọ̀: ${JSON.stringify(messages)}
          
          GBỌDỌ̀ DAHUN NÍ YORÙBÁ NÌKAN, kò tó bá ti jẹ́ pé ìbéèrè náà wà ní èdè mìíràn.
          ` :
          `
          Répondez à cette question sur le document ci-joint : ${input}.
          Répondez en tant que chatbot avec des messages courts et du texte uniquement (pas de démarques, de balises ou de symboles).
          Si le document contient du code, affiche-le correctement formaté, avec des retours à la ligne et une indentation propre. Formate aussi bien le texte stp.
          Si le code est long, ajoute le langage après les 3 backticks.
          Chat history: ${JSON.stringify(messages)}
          `;

        const result = await model.generateContent([
          {
            inlineData: {
              data: file.file,
              mimeType: file.type,
            },
          },
          chatPrompt,
        ]);

        chatMessages = [...chatMessages.filter((msg) => msg.role !== 'loader'), { role: "model", text: result.response.text() }];
        setMessages(chatMessages);
      } catch (error) {
        const errorMessage = selectedLanguage === 'yoruba' ? 
          "Àṣìṣe nínú ríràn àwọn ìròyìn, jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan sí i." :
          "Error sending messages, please try again later.";
        chatMessages = [...chatMessages.filter((msg) => msg.role !== 'loader'), { role: "error", text: errorMessage }];
        setMessages(chatMessages);
        console.error(error);
      }
    }
  }

  const chatTitle = selectedLanguage === 'yoruba' ? 'Ìbánisọ̀rọ̀' : 'Chat';
  const placeholderText = selectedLanguage === 'yoruba' ? 
    'Béèrè ìbéèrè rẹ níhìn-ín nípa àkọ́ọ̀lẹ̀ náà' : 
    'Posez votre question ici a propos du document';
  const buttonText = selectedLanguage === 'yoruba' ? 'Firánṣẹ́' : 'Envoyer';

  return (

    <section className={styles.chatWindow}>
      <h2 className={styles.title}>{chatTitle}</h2>
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
          placeholder={placeholderText}
        />
        <button onClick={handleSendMessage}>{buttonText}</button>
      </div>
    </section>

  );
}

export default Chat;
