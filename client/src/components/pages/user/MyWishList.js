import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import port from './../../data/port.json'
import MovieCardInModal from "../../MovieCardInModal";


const API_KEY = process.env.REACT_APP_API_KEY;


const MyWishList = ({wishList})=>{
  const [cookies, setCookie, removeCookie] = useCookies(["userData"]);


  return(
    <>
      <h1>위시리스트</h1>
      {
        wishList.map((item, index)=>(
          <MovieCardInModal key={index} isHeart={true} {...item} />
        ))
      }
    </>
  )



}

export default MyWishList;