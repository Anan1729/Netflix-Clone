import React, { useState, useEffect } from "react";
import axios from "../../Utility/Movieinstance";
import requests, { BANNER_BASE } from "../../Utility/requestUrls";
import { Play, Info, X, Calendar, Languages, Award } from "lucide-react";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import styles from "./Banner.module.css";

function Banner() {
  const [movie, setMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Query our dynamically calculated current year endpoint track
        const request = await axios.get(requests.fetchLatest);
        const results = request.data?.results;

        if (results && results.length > 0) {
          // Selects a popular movie matching the active year
          const randomMovie =
            results[Math.floor(Math.random() * results.length)];
          setMovie(randomMovie);
        } else {
          // Fallback strategy A: If the year track is empty, fall back to weekly trending entries
          const fallbackRequest = await axios.get(requests.fetchTrending);
          const fallbackResults = fallbackRequest.data?.results;
          if (fallbackResults && fallbackResults.length > 0) {
            setMovie(
              fallbackResults[
                Math.floor(Math.random() * fallbackResults.length)
              ],
            );
          }
        }
      } catch (error) {
        console.error("Production pipeline fallback activated:", error);
        // Fallback strategy B: Secure recovery track if network requests fail
        try {
          const fallbackRequest = await axios.get(requests.fetchTrending);
          if (fallbackRequest.data?.results?.length > 0) {
            setMovie(fallbackRequest.data.results[0]);
          }
        } catch (fallbackError) {
          console.error("All data channels exhausted", fallbackError);
        }
      }
    }
    fetchData();
  }, []); // Empty dependency array ensures this runs once when the app mounts

  const handlePlayClick = async () => {
    if (trailerUrl) {
      setTrailerUrl("");
      return;
    }

    const movieName = movie?.title || movie?.name || movie?.original_name || "";
    const exactTrailerQuery = `${movieName} Official Trailer`;

    try {
      // Strategy 1: Search using the refined movie trailer keyword text string
      const url = await movieTrailer(exactTrailerQuery);
      if (url) {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get("v"));
        return;
      }
      throw new Error("Scraper returned empty path");
    } catch (scrapingError) {
      console.log(
        "Text search missed. Initializing direct database deep fetch...",
      );

      // Strategy 2: Fetch video array directly from TMDB database via content ID
      if (movie?.id) {
        try {
          const mediaType = movie.first_air_date ? "tv" : "movie";
          const response = await axios.get(`/${mediaType}/${movie.id}/videos`);
          const videoList = response?.data?.results || [];

          // Find an item explicitly tagged as a 'Trailer' by TMDB
          const trailerVideo = videoList.find(
            (vid) =>
              (vid.type === "Trailer" || vid.type === "Teaser") &&
              vid.site === "YouTube",
          );

          if (trailerVideo?.key) {
            setTrailerUrl(trailerVideo.key);
          } else if (videoList.length > 0) {
            setTrailerUrl(videoList[0].key);
          } else {
            // Strategy 3 Fallback: Opens search directly in a separate safe tab to protect layout tracking
            window.open(
              `https://youtube.com/results?search_query=${encodeURIComponent(exactTrailerQuery)}`,
            );
          }
        } catch (apiError) {
          console.error("All internal database queries exhausted:", apiError);
          window.open(
            `https://youtube.com/results?search_query=${encodeURIComponent(exactTrailerQuery)}`,
          );
        }
      }
    }
  };

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  const matchScore = movie?.vote_average
    ? Math.round(movie.vote_average * 10)
    : 94;

  return (
    <>
      <div
        className={styles.Banner}
        style={{
          backgroundSize: "cover",
          backgroundImage: movie?.backdrop_path
            ? `url("${BANNER_BASE}${movie.backdrop_path}")`
            : "none",
          backgroundPosition: "center top",
        }}
      >
        <div className={styles.contents}>
          <div className={styles.brandBadge}>
            <span className={styles.brandN}>N</span>
            <span className={styles.brandType}>S E R I E S</span>
          </div>

          <h1 className={styles.bannerTitle}>
            {movie?.title ||
              movie?.name ||
              movie?.original_name ||
              "Loading..."}
          </h1>

          <p className={styles.bannerDescription}>
            {movie?.overview
              ? truncate(movie.overview, 150)
              : "No description available."}
          </p>

          <div className={styles.bannerButtons}>
            <button
              className={`${styles.bannerButton} ${styles.btnPlay}`}
              onClick={handlePlayClick}
            >
              <Play size={22} fill="currentColor" />
              Play
            </button>
            <button
              className={`${styles.bannerButton} ${styles.btnInfo}`}
              onClick={() => setIsInfoOpen(true)}
            >
              <Info size={22} />
              More Info
            </button>
          </div>
        </div>

        <div className={styles.FadeBottom}></div>
      </div>

      {/* 1. TRAILER MODAL OVERLAY PANEL */}
      {trailerUrl && (
        <div className={styles.modalOverlay} onClick={() => setTrailerUrl("")}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeModalBtn}
              onClick={() => setTrailerUrl("")}
            >
              <X size={24} />
            </button>
            <div className={styles.videoWrapper}>
              <YouTube videoId={trailerUrl} opts={opts} />
            </div>
          </div>
        </div>
      )}

      {/* 2. MORE INFO DETAILS OVERLAY MODAL */}
      {isInfoOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsInfoOpen(false)}
        >
          <div
            className={`${styles.modalContent} ${styles.infoModalCard}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeModalBtn}
              onClick={() => setIsInfoOpen(false)}
            >
              <X size={24} />
            </button>

            <div
              className={styles.infoModalHero}
              style={{
                backgroundImage: `linear-gradient(to top, #181818 0%, rgba(24,24,24,0.4) 100%), url("${BANNER_BASE}${movie?.backdrop_path}")`,
              }}
            >
              <h2 className={styles.infoModalTitle}>
                {movie?.title || movie?.name || movie?.original_name}
              </h2>
            </div>

            <div className={styles.infoModalBody}>
              <div className={styles.infoMetaRow}>
                <span className={styles.infoMatch}>{matchScore}% Match</span>
                <span className={styles.infoYear}>
                  {movie?.release_date?.substring(0, 4) ||
                    movie?.first_air_date?.substring(0, 4) ||
                    "2026"}
                </span>
                <span className={styles.infoBadge}>HD</span>
                <span className={styles.infoBadge}>TV-MA</span>
              </div>

              <p className={styles.infoFullPlot}>
                {movie?.overview ||
                  "No extended overview summary plot data currently recorded for this program."}
              </p>

              <div className={styles.infoTechnicalGrid}>
                <div className={styles.techItem}>
                  <Calendar size={16} />
                  <span>
                    Popularity Index:{" "}
                    <strong>{Math.round(movie?.popularity || 0)}</strong>
                  </span>
                </div>
                <div className={styles.techItem}>
                  <Languages size={16} />
                  <span>
                    Original Language:{" "}
                    <strong>
                      {movie?.original_language?.toUpperCase() || "EN"}
                    </strong>
                  </span>
                </div>
                <div className={styles.techItem}>
                  <Award size={16} />
                  <span>
                    Vote Density Count:{" "}
                    <strong>{movie?.vote_count || 1200} reviews</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Banner;
