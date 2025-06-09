import { Link } from '@inertiajs/react';
import '../../css/component/Footer.css';
import img from '../../assets/photo/acceui_page/Research paper-bro.svg'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section logo-section">
                    <div className="footer-logo">
                        <img src={img} alt="e~Learning Logo" />
                        <h2>e~Learning</h2>
                    </div>
                    <p>Votre plateforme d'apprentissage en ligne</p>
                </div>
                
                <div className="footer-section">
                    <h3>Liens rapides</h3>
                    <ul>
                        <li><Link href="/">Accueil</Link></li>
                        <li><Link href="/cours">Cours</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact</h3>
                    <ul className="contact-info">
                        <li>Email: contact@example.com</li>
                        <li>Tél: +123 456 789</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Suivez-nous</h3>
                    <div className="social-links">
                        <a href="#" className="social-link">Facebook</a>
                        <a href="#" className="social-link">Twitter</a>
                        <a href="#" className="social-link">LinkedIn</a>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} e~Learning. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer; 