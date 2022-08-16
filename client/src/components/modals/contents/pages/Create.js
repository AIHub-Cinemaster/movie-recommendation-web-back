import { useEffect, useState } from "react";
import {useCookies} from "react-cookie";
import $ from "jquery";
import axios from "axios";
import port from './../../../data/port.json'
import { useNavigate } from "react-router-dom";


const Create = ({createIsOpen, setCreateIsOpen, movieId, getReviewData})=>{
  const [cookies, setCookie, removeCookie] = useCookies(["userData"]);

  const [createReview, setCreateReview] = useState({
    movieId: movieId,
    title:"",
    content:"",
    shortId:cookies.userData.shortId,
    star:0
  });

  // useEffect(()=>{
  //   console.log(createReview);
  // }, [createReview]);

  const onChangeCreateReview = (event)=>{
    // value 값에 따라 별 색칠
    if(event.target.name === "star"){
      $(`.star span`).css({ width: `${event.target.value * 10 * 2}%` });
    }
    
    setCreateReview({
      ...createReview,
      [event.target.name]: event.target.value
    });
  }

  
  const onClickCreateReviewButton = ()=>{
    sendCreateReview().then(res=>{
      alert(res.data.result)
      setCreateIsOpen(false)
      getReviewData()
    }).catch(error=>{
      // console.log("작성실패", error);
      alert(error.response.data.fail);
    })
  }

  const sendCreateReview = async()=>{
    return await axios.post(port.url + "/review/add", createReview)
  }

  return (
      <div className="review-create-card">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">TITLE</label>
          <input type="text" className="form-control" onChange={onChangeCreateReview} name="title" id="title" placeholder="Title Here"/>
        </div>

        <div className="mb-3">
          <label htmlFor="star" className="form-label">STAR</label><br/>
          <span className="star">
            ★★★★★
            <span>★★★★★</span>
            <input name="star" type="range" step=".5" min="0" max="5" onChange={onChangeCreateReview} />
          </span>
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">CONTENT</label>
          <textarea className="form-control" onChange={onChangeCreateReview} name="content" id="content" rows="5" placeholder="Content Here"></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Author</label>
          <input type="text" className="form-control" name="name" id="name" placeholder={cookies.userData.name} disabled />
        </div>

        <div style={{textAlign:"right"}}>
          <button type="button" onClick={onClickCreateReviewButton} className="button grey-button-small" style={{marginRight:"5px"}}>SUBMIT</button>
          <button type="button" onClick={()=>{setCreateIsOpen(false)}} className="button grey-button-small">BACK</button>
        </div>      
      </div>
  )
}

export default Create;