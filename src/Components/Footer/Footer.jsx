import React from "react";
import styles from "./Footer.module.css"; // Importing CSS Modules
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"; // Importing icons

const Footer = () => {
  // Array of links for the first column
  const column1Links = [
    "Audio Description",
    "Investor Relations",
    "Legal Notices",
  ];

  // Array of links for the second column
  const column2Links = ["Help Centre", "Jobs", "Cookie Preferences"];

  // Array of links for the third column
  const column3Links = ["Gift Cards", "Terms of Use", "Corporate Information"];

  // Array of links for the fourth column
  const column4Links = ["Media Centre", "Privacy", "Contact Us"];

  // Helper function to render a list of links from an array
  const renderLinks = (linksArray) => (
    <ul className={styles.linkList}>
      {linksArray.map((linkText, index) => (
        <li key={index} className={styles.linkItem}>
          <a href="#" className={styles.link}>
            {linkText}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Social Media Icons Section */}
        <div className={styles.socialIconsContainer}>
          <a href="#" aria-label="Facebook" className={styles.socialIcon}>
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Instagram" className={styles.socialIcon}>
            <FaInstagram />
          </a>
          <a href="#" aria-label="Twitter" className={styles.socialIcon}>
            <FaTwitter />
          </a>
          <a href="#" aria-label="YouTube" className={styles.socialIcon}>
            <FaYoutube />
          </a>
        </div>

        {/* Links Grid Section */}
        <div className={styles.linksGrid}>
          {renderLinks(column1Links)}
          {renderLinks(column2Links)}
          {renderLinks(column3Links)}
          {renderLinks(column4Links)}
        </div>

        {/* Footer Text (Copyright/Date) */}
        <p className={styles.footerText}>© 1997-2026 Netflix, Inc.</p>
      </div>
      <div
        style={{
          backgroundColor: "#141414",
          color: "#808080",
          textAlign: "center",
          padding: "20px 10px",
          fontSize: "13px",
          lineHeight: "1.5",
          borderTop: "1px solid #222",
          width: "100%",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <span style={{ color: "#e50914", marginRight: "5px" }}>⚠️</span>
        <strong>Educational Portfolio Project:</strong> This is a demo clone
        built for learning purposes only. It is not affiliated with Netflix and
        does not collect any user data.
      </div>
    </footer>
  );
};

export default Footer;
