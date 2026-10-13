import React from "react";
import styles from "./Row.module.css";
import SlideShow from "../SlideShow/SlideShow";
import requests from "../../Utility/requestUrls";

function Row() {
  return (
    <div className={styles.mainWrapper}>
      {/* 1. New & Popular Anchor */}
      <div id="latest-section">
        <SlideShow
          title="New & Popular on Netflix"
          fetchUrl={requests.fetchLatest}
        />
      </div>

      {/* 2. TV Shows Anchor */}
      <div id="tv-shows-section">
        <SlideShow
          title="NETFLIX ORIGINALS"
          fetchUrl={requests.fetchNetflixOriginals}
          isLargeRow={true}
        />
      </div>

      {/* 3. Movies Anchor */}
      <div id="movies-section">
        <SlideShow title="Trending Now" fetchUrl={requests.fetchTrending} />
        <SlideShow title="Top Rated" fetchUrl={requests.fetchTopRated} />
      </div>

      <SlideShow title="Action Movies" fetchUrl={requests.fetchActionMovies} />
      <SlideShow title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
      <SlideShow
        title="Romance Movies"
        fetchUrl={requests.fetchRomanceMovies}
      />
      <SlideShow title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
      <SlideShow title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
    </div>
  );
}

export default Row;
