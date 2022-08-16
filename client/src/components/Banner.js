import React from "react";

const Banner = ({ movie }) => {
  return (
    <div
      className="banner"
      style={{
        backgroundImage:
          "url(" +
          `https://www.themoviedb.org/t/p/w1920_and_h600_multi_faces${movie.poster_path}` +
          ")",
      }}
    >
      <div className="banner-info">
        <h1 className="white-xl-font mb-4">{movie.title}</h1>
        {/* <p className="grey-small-font">{movie.vote_average}   /   {movie.release_date}</p> */}

        <span className="white-middle-font">SUMMARY</span>
        <p className="grey-small-font mt-1">{movie.overview}</p>
      </div>
    </div>
  );
};

export default Banner;