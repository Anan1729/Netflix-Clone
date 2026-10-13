import React, { useState } from "react";
import axios from "../../Utility/Movieinstance";
import requests from "../../Utility/requestUrls"; // Imported requests mapping to read key strings
import styles from "./Card.module.css";
import { FaCirclePlay } from "react-icons/fa6";
import { BsPlus } from "react-icons/bs";
import { GoCheckCircleFill } from "react-icons/go";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { X, Calendar, Languages, Award } from "lucide-react";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer"; // Added back text scraper as intermediate dynamic bridge

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";

function MovieCard({ movie, isLarge = false }) {
  const [isMyList, setIsMyList] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const imagePath = isLarge ? movie?.poster_path : movie?.backdrop_path;

  if (!imagePath) return null;

  const title =
    movie?.title || movie?.name || movie?.original_name || "Untitled";
  const releaseYear = movie?.release_date
    ? movie.release_date.split("-")[0]
    : movie?.first_air_date
      ? movie.first_air_date.split("-")[0]
      : "2026";

  // Dynamic Multi-Strategy Trailer Fetch Handler
  const handlePlayClick = async (e) => {
    e.stopPropagation();
    if (trailerUrl) {
      setTrailerUrl("");
      return;
    }

    // Extraction: Isolate dynamic API Key from your request urls sheet
    const urlParamsObj = new URLSearchParams(
      requests.fetchTrending.split("?")[1],
    );
    const apiKey = urlParamsObj.get("api_key") || "";

    try {
      const mediaType = movie.first_air_date ? "tv" : "movie";
      // Strategy 1: Fetch explicit video objects array directly from TMDB Registry using authentication tokens
      const response = await axios.get(
        `/${mediaType}/${movie.id}/videos?api_key=${apiKey}`,
      );
      const videoList = response?.data?.results || [];

      const officialTrailer = videoList.find(
        (vid) =>
          (vid.type === "Trailer" || vid.type === "Teaser") &&
          vid.site === "YouTube",
      );

      if (officialTrailer?.key) {
        setTrailerUrl(officialTrailer.key);
        return;
      }
      throw new Error("No database key registered");
    } catch (dbError) {
      console.log(
        "Database fetch missed. Swapping to text parsing string scraper engine...",
      );

      // Strategy 2: Dynamic Fallback text scraper queries YouTube directly based on movie title text context
      const refinedQuery = `${title} Official Trailer`;
      movieTrailer(refinedQuery)
        .then((url) => {
          if (url) {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get("v"));
          } else {
            // Strategy 3: Ultimate manual redirect if scrapers fail
            window.open(
              `https://youtube.com/results?search_query=${encodeURIComponent(exactTrailerQuery)}`,
            );
          }
        })
        .catch(() => {
          window.open(
            `https://youtube.com/results?search_query=${encodeURIComponent(exactTrailerQuery)}`,
          );
        });
    }
  };

  // Find your info toggle function inside MovieCard.jsx
  const handleInfoToggle = (e) => {
    e.stopPropagation();
    const nextState = !isDetailOpen;
    setIsDetailOpen(nextState);

    // Triggers the row layout priority shift if the parent function prop is passed down
    if (onToggleDrawer) {
      onToggleDrawer(nextState);
    }
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <>
      <div
        className={`${styles.cardContainer} ${isLarge ? styles.largeCard : ""}`}
      >
        <div className={styles.cardWrapper}>
          <img
            className={styles.poster}
            src={`${IMAGE_BASE_URL}${imagePath}`}
            alt={title}
            loading="lazy"
          />

          <div className={styles.hoverCard}>
            <img
              className={styles.hoverImage}
              src={`${IMAGE_BASE_URL}${movie?.backdrop_path || movie?.poster_path}`}
              alt={title}
            />

            <div className={styles.hoverInfo}>
              <div className={styles.buttonsRow}>
                <div className={styles.leftButtons}>
                  <FaCirclePlay
                    className={`${styles.circleButton} ${styles.playBtn}`}
                    onClick={handlePlayClick}
                  />
                  <button
                    className={styles.iconButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMyList(!isMyList);
                    }}
                    aria-label="Add to List"
                  >
                    {isMyList ? (
                      <GoCheckCircleFill className={styles.checkedBtn} />
                    ) : (
                      <BsPlus className={styles.plusBtn} />
                    )}
                  </button>
                </div>
                <div className={styles.rightButtons}>
                  <IoIosArrowDropdownCircle
                    className={styles.circleButton}
                    onClick={handleInfoToggle}
                  />
                </div>
              </div>

              <div className={styles.metadataRow}>
                <span className={styles.matchScore}>
                  {movie?.vote_average
                    ? `${Math.round(movie.vote_average * 10)}% Match`
                    : "98% Match"}
                </span>
                <span className={styles.maturityRating}>
                  {movie?.adult ? "18+" : "13+"}
                </span>
                <span className={styles.duration}>{releaseYear}</span>
                <span className={styles.resolutionBadge}>HD</span>
              </div>

              <div className={styles.cardTitleText}>{title}</div>
            </div>
          </div>
        </div>
      </div>

      {trailerUrl && (
        <div
          className={styles.cardModalOverlay}
          onClick={() => setTrailerUrl("")}
        >
          <div
            className={styles.cardModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.cardCloseBtn}
              onClick={() => setTrailerUrl("")}
            >
              <X size={22} />
            </button>
            <div className={styles.cardVideoWrapper}>
              <YouTube videoId={trailerUrl} opts={opts} />
            </div>
          </div>
        </div>
      )}

      {/* 2. MORE INFO OVERLAY CARD MODAL (FIXED LAYER STACKING) */}
      {isDetailOpen && (
        <div
          className={
            styles.cardGlobalOverlay
          } /* Forces full-screen focus workspace */
          onClick={() => setIsDetailOpen(false)}
        >
          <div
            className={styles.cardDetailBox}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button with high-contrast priority tracking */}
            <button
              className={styles.cardCloseBtn}
              onClick={() => setIsDetailOpen(false)}
            >
              <X size={22} />
            </button>

            {/* Widescreen Card Banner Header Layout */}
            <div
              className={styles.modalBannerHero}
              style={{
                backgroundImage: `linear-gradient(to top, #181818 0%, rgba(24,24,24,0) 100%), url("${IMAGE_BASE_URL}${movie?.backdrop_path || movie?.poster_path}")`,
              }}
            >
              <h3 className={styles.modalHeroTitle}>{title}</h3>
            </div>

            {/* Core Metadata & Description Typography Body */}
            <div className={styles.detailBody}>
              <div className={styles.drawerMeta}>
                <span className={styles.matchScore}>
                  {movie?.vote_average
                    ? `${Math.round(movie.vote_average * 10)}% Match`
                    : "98% Match"}
                </span>
                <span className={styles.metaYear}>{releaseYear}</span>
                <span className={styles.maturityRating}>
                  {movie?.adult ? "18+" : "13+"}
                </span>
                <span className={styles.hdBadge}>HD</span>
              </div>

              <p className={styles.plotSummaryText}>
                {movie?.overview ||
                  "No custom synopsis description recorded for this title item profile."}
              </p>

              {/* Analytics Technical Specification Grid */}
              <div className={styles.drawerSpecs}>
                <div className={styles.specLine}>
                  <Calendar size={14} />{" "}
                  <span>
                    Popularity Score:{" "}
                    <strong>{Math.round(movie?.popularity || 0)}</strong>
                  </span>
                </div>
                <div className={styles.specLine}>
                  <Languages size={14} />{" "}
                  <span>
                    Language Vector:{" "}
                    <strong>
                      {movie?.original_language?.toUpperCase() || "EN"}
                    </strong>
                  </span>
                </div>
                <div className={styles.specLine}>
                  <Award size={14} />{" "}
                  <span>
                    Database Votes:{" "}
                    <strong>{movie?.vote_count || 450} submissions</strong>
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

export default MovieCard;
