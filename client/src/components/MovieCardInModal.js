import Modal from 'react-modal';
import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import MovieModal from './modals/MovieModal';



const getPosterURL = (posterpath)=>{
  return `https://www.themoviedb.org/t/p/w154/${posterpath}`
}

const MovieCardInModal = (props) => {
  
  const [isOpen, setOpen] = useState(false);

  const handleClick = ()=>{
    setOpen(true);
  }

  return(
    <>
      {/* <h1>{props.isHeart}</h1> */}
      <div style={{display:"inline-block"}}>
        <img
          onClick={handleClick}
          src={getPosterURL(props.poster_path)} 
          alt={props.original_title} />
      </div>  
      

      <MovieModal isOpen={isOpen} setOpen={setOpen} data={props} isHeart={props.isHeart} />
    </>
  )
}

export default MovieCardInModal;