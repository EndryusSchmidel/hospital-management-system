import "./Footer.css";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="fixed-footer">
            <div className="footer-container">
                {/* Div vazia para ajudar no alinhamento central do item seguinte */}
                <div className="footer-left"></div>

                <div className="footer-center">
                    <p><FaCode className="footer-icon"/>Desenvolvido por <strong>Endryus Schmidel</strong> &copy; {new Date().getFullYear()}</p>
                </div>

                <div className="footer-right">
                    <a href="https://github.com/EndryusSchmidel" target="_blank" rel="noreferrer">
                        <FaGithub />
                    </a>
                    <a href="https://linkedin.com/in/endryus-schmidel" target="_blank" rel="noreferrer">
                        <FaLinkedin />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;