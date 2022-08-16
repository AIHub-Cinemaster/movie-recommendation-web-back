import React from "react";
import { useSelector } from "react-redux";
import MovieModal from "./modals/MovieModal";
import { useEffect, useState } from 'react';
import {useCookies} from "react-cookie";

import heartGrey from './../assets/images/heartGrey.png'
import heartRed from './../assets/images/heartRed.png'

const MovieCard = ({ item, isHeart }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["userData"]);

  const { genreList } = useSelector((state) => state.movie);

  const [isOpen, setOpen] = useState(false);

  const handleClick = ()=>{
    setOpen(true);
  }

  return (
    <>
      <div
        className="card"
        onClick={handleClick}
        style={{
          backgroundImage:
            `url(https://www.themoviedb.org/t/p/w220_and_h330_face${item.poster_path})`,
          margin:"15px 10px"
        }}
      >
        {/* <div className="overlay">
          {
            isHeart ? (
              <><img src={heartRed} width="25px" /></>
            ) : (
              <><img src={heartGrey} width="25px" /></>
            )
          }
        </div> */}
        
      
      </div>

      <MovieModal isOpen={isOpen} setOpen={setOpen} data={item} isHeart={isHeart} />
    </>
    

  );
};

export default MovieCard;
