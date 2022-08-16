import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import axios from "axios";
import MovieCardInModal from './../../MovieCardInModal'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const API_KEY = process.env.REACT_APP_API_KEY;



const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide : 5
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};


const GetRecommendations = (props)=>{
  const [rcmdMovies, setRcmdMovies] = useState([])

  useEffect(()=>{
    axios.get(`https://api.themoviedb.org/3/movie/${props.id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`).then(res=>{
      setRcmdMovies(res.data.results)
    }).catch(err=>{console.log(err)})
  },[])


  return (
    <div>
      <Carousel
        responsive={responsive}
        // autoPlay={movies.deviceType !== "mobile" ? true : false}
        autoPlay={true}
        autoPlaySpeed={5000}
        infinite={true}
      > 
        {/* <MovieSlide movie={rcmdMovies} /> */}
        {
          rcmdMovies.map((movie, index)=>{
            return <MovieCardInModal key={index} {...movie} />
          })
        }
      </Carousel>
    </div>
  )
}
export default GetRecommendations;