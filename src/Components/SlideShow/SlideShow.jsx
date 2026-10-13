import React, { useState, useEffect } from "react";
import axios from "../../Utility/Movieinstance";
import styles from "./SlideShow.module.css";
import MovieCard from "../Card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

function SlideShow({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRowElevated, setIsRowElevated] = useState(false);

  useEffect(() => {
    if (!fetchUrl) return;
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results || []);
      } catch (error) {
        console.error(`Error loading items for row: ${title}`, error);
      }
    }
    fetchData();
  }, [fetchUrl, title]);

  useEffect(() => {
    const handleGlobalSearch = (e) => {
      setSearchQuery(e.detail.toLowerCase());
    };
    window.addEventListener("netflixSearch", handleGlobalSearch);
    return () =>
      window.removeEventListener("netflixSearch", handleGlobalSearch);
  }, []);

  // SMART SEARCH FILTER: Checks both the movie title AND the row category name!
  const filteredMovies = movies.filter((movie) => {
    const titleText = (
      movie?.title ||
      movie?.name ||
      movie?.original_name ||
      ""
    ).toLowerCase();
    const rowTitleText = (title || "").toLowerCase();

    // Condition: Show the card if it matches the text search, OR if the user searched for the row category name
    return (
      titleText.includes(searchQuery) || rowTitleText.includes(searchQuery)
    );
  });

  // If a search query is active and nothing matches, hide the row track container
  if (filteredMovies.length === 0 && searchQuery !== "") return null;

  return (
    <div
      className={`${styles.rowContainer} ${isRowElevated ? styles.elevatedTrack : ""}`}
    >
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.Row}>
        <Swiper
          modules={[Navigation]}
          navigation={true}
          spaceBetween={10}
          slidesPerView={5.8}
          slidesPerGroup={2}
          loop={filteredMovies.length > 6}
          breakpoints={{
            320: { slidesPerView: 2.2, spaceBetween: 5 },
            640: { slidesPerView: 3.5, spaceBetween: 8 },
            1024: { slidesPerView: 5.8, spaceBetween: 10 },
          }}
        >
          {filteredMovies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <MovieCard
                movie={movie}
                isLarge={isLargeRow}
                onToggleDrawer={(isOpen) => setIsRowElevated(isOpen)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default SlideShow;
