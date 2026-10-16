# 🎬 Netflix Clone App

A high-fidelity, production-ready, fully responsive **Netflix Clone** landing page application built from the ground up using **React (Vite)** and modular CSS components. This application streams content metadata, cinema graphics, and video backdrops seamlessly using live data vectors from the official **TMDB API** registry.

## 🚀 Live Demo Link
👉 **[Click Here to View the Live Application](https://ananya-capstone-pro.netlify.app/)** 
---

## ✨ Features & Architecture Highlights

*   **Live Multi-Category Slider Rows**: Leverages optimized `Swiper.js` configurations to bundle horizontal carousel structures with smooth navigation transitions.
*   **Dynamic Search Filter Matrix**: Features an expanding navigation search engine capable of parsing cross-property title fragments (`movie.title`, `movie.name`, `movie.original_name`) and category tags in real time.
*   **Dynamic Video Trailer Stream Overlay**: Embedded integration with the `react-youtube` library to pull dynamic trailer video codes directly from TMDB registries with text scraper fallbacks.
*   **Environment Level Variable Protections**: Complete encapsulation of private infrastructure access tokens using standard `.env` configuration guards to shield developer keys.

---

## 🛠️ Technology Stack Mastered

*   **Frontend Library**: React (Functional components, custom hooks, spatial listeners)
*   **Build Bundler Engine**: Vite (Rapid module hot reloading, lightweight production distribution packs)
*   **Styling Architecture**: CSS Modules (`.module.css` scoping frameworks to eliminate global namespace leakage conflicts)
*   **Database Integration**: The Movie Database (TMDB) REST API (Axios instance configurations)
*   **Motion & Sliders**: Swiper.js & Lucide React Icon vector nodes

---

## 📦 Local Installation & Setup Steps

Follow these boundaries to mount and test the execution layout inside your local workspace:

1. **Clone the project repository tree:**
   ```bash
   git clone https://github.com/Anan1729/Netflix-Clone.git
   cd Netflix-Clone
   ```

2. **Install all required node package dependency bundles:**
   ```bash
   npm install
   ```

3. **Configure your private application environment authentication tokens:**
   Create a `.env` file right inside your root tree directory folder and add your exact dual variables:
   ```text
   VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
   VITE_TMDB_BASE_URL=https://themoviedb.org
   ```

4. **Boot up the local development host server:**
   ```bash
   npm run dev
   ```

---

## 🔒 Project Security Integrity Note
*Private configurations, distribution output folders, local runtime cache structures, and the native `.env` files are strictly encapsulated inside `.gitignore` tracking rules to uphold standard cybersecurity parameters across public distribution channels.*

---

## ⚖️ Disclaimer & Copyright Notice

### 🔏 Non-Commercial Educational Showcase
This application is a software clone built strictly for **educational, non-commercial portfolio presentation purposes**. It is not intended for commercial distribution, monetization, or public streaming usage.

### 🏷️ Trademark Attribution
*   **Netflix** is a registered trademark of Netflix, Inc. This project is entirely unaffiliated with, authorized, maintained, sponsored, or endorsed by Netflix, Inc. or any of its subsidiaries.
*   **TMDB** data assets and trademark imagery are properties of their respective owners. Content metadata, imagery, backdrops, and video links are streamed live utilizing public developer endpoints under TMDB API usage criteria.

### 📜 Digital Millennium Copyright Act (DMCA) & Fair Use Compliance
*This repository complies with section 107 of the US Copyright Act, which allows "fair use" for purposes such as criticism, comment, news reporting, teaching, scholarship, and research. All code written within this repository is original frontend architecture constructed for engineering development study.*
