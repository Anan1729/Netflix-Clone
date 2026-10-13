import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import { Search, User, ChevronDown, Bell } from "lucide-react";
import styles from "./Header.module.css";

function Header() {
  const [isHeaderBlack, setIsHeaderBlack] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // Mobile tracking state

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileNavRef = useRef(null); // Reference for mobile outside click tracking

  // Black background toggle on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHeaderBlack(true);
      } else {
        setIsHeaderBlack(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Closes search, avatar dropdown, and mobile menu automatically when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target)
      ) {
        setIsMobileNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header
      className={`${styles["header-container"]} ${isHeaderBlack ? styles["header-solid-black"] : ""}`}
    >
      {/* LeftSide: LOGO, Desktop Nav Links, and Mobile Browse Dropdown */}
      <div className={styles["header-left"]}>
        <Link to="/">
          <img
            className={styles["header-logo"]}
            src={logo}
            alt="Netflix Logo"
          />
        </Link>

        {/* Standard Desktop Navigation Track */}
        <nav className={styles["header-nav-links"]}>
          <Link to="/" className={styles["nav-link"]}>
            Home
          </Link>

          {/* Corrected to native anchor links for flawless page scrolling */}
          <a href="#tv-shows-section" className={styles["nav-link"]}>
            TV Shows
          </a>
          <a href="#movies-section" className={styles["nav-link"]}>
            Movies
          </a>
          <a href="#latest-section" className={styles["nav-link"]}>
            New & Popular
          </a>

          <Link to="/my-list" className={styles["nav-link"]}>
            My List
          </Link>
          <Link to="/browse-languages" className={styles["nav-link"]}>
            Browse by Language
          </Link>
        </nav>

        {/* Authentic Netflix Mobile "Browse" Setup */}
        <div ref={mobileNavRef} className={styles["mobile-nav-container"]}>
          <div
            className={styles["mobile-browse-btn"]}
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          >
            <span>Browse</span>
            <ChevronDown
              size={14}
              className={`${styles["mobile-chevron"]} ${isMobileNavOpen ? styles.flipped : ""}`}
            />
          </div>

          {isMobileNavOpen && (
            <div className={styles["mobile-nav-dropdown"]}>
              <div className={styles["mobile-dropdown-arrow"]}></div>
              <Link
                to="/"
                className={styles["mobile-nav-item"]}
                onClick={() => setIsMobileNavOpen(false)}
              >
                Home
              </Link>

              {/* Corrected to native anchor links for flawless page scrolling on mobile */}
              <a
                href="#tv-shows-section"
                className={styles["mobile-nav-item"]}
                onClick={() => setIsMobileNavOpen(false)}
              >
                TV Shows
              </a>
              <a
                href="#movies-section"
                className={styles["mobile-nav-item"]}
                onClick={() => setIsMobileNavOpen(false)}
              >
                Movies
              </a>
              <a
                href="#latest-section"
                className={styles["mobile-nav-item"]}
                onClick={() => setIsMobileNavOpen(false)}
              >
                New & Popular
              </a>

              <Link
                to="/my-list"
                className={styles["mobile-nav-item"]}
                onClick={() => setIsMobileNavOpen(false)}
              >
                My List
              </Link>
              <Link
                to="/browse-languages"
                className={styles["mobile-nav-item"]}
                onClick={() => setIsMobileNavOpen(false)}
              >
                Browse by Language
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* RightSide: Search bar, Bell, Avatar drop down */}
      <div className={styles["header-right"]}>
        <div
          ref={searchRef}
          className={`${styles["search-bar-wrapper"]} ${isSearchOpen ? styles.open : ""}`}
        >
          <Search
            className={styles["header-icon"]}
            size={20}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          />
          {/* Inside your Header.jsx search bar wrapper */}
          <input
            type="text"
            className={styles["search-input"]}
            placeholder="Titles, genres..."
            onChange={(e) => {
              // Dispatches a global event containing the search text input string query
              const searchEvent = new CustomEvent("netflixSearch", {
                detail: e.target.value,
              });
              window.dispatchEvent(searchEvent);
            }}
          />
        </div>

        <Bell className={styles["header-icon"]} size={20} />

        <div ref={dropdownRef} className={styles["header-profile-container"]}>
          <div
            className={styles["header-profile-box"]}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <User size={20} />
            <ChevronDown
              className={`${styles["header-chevron"]} ${isDropdownOpen ? styles.flipped : ""}`}
              size={16}
            />
          </div>

          {isDropdownOpen && (
            <div className={styles["profile-dropdown-menu"]}>
              <div className={styles["dropdown-item"]}>Manage Profiles</div>
              <div className={styles["dropdown-item"]}>Account Info</div>
              <div
                className={`${styles["dropdown-item"]} ${styles["border-top"]}`}
              >
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
