import axios from 'axios';
import { useEffect, useState } from 'react';
import port from './../../data/port.json'
import Create from './pages/Create';
import {useCookies} from "react-cookie";
import $ from "jquery";

const Reviews = (props)=>{
  const [cookies, setCookie, removeCookie] = useCookies(["userData"]);

  const [reviewData, setReviewData] = useState([]);
  const [createIsOpen, setCreateIsOpen] = useState(false);

  useEffect(()=>{
    getReviewData()
  },[])

  const getReviewData = ()=>{

    // return await axios.get(port.url + `/reviewlist/${props.id}`)
    try{
      axios.get(port.url + `/reviewlist/${props.id}`).then(res=>{
        // console.log("get review", res.data)
        setReviewData(res.data);
      })
    } catch(error) {
      console.log(error)
    }
  }

  const onClickDeleteBtn = ()=>{
    if(window.confirm("삭제 하시겠습니까?")){
      deleteReview().then(res=>{
        alert(res.data.result)
        getReviewData()
      }).catch(err=>{
        console.log(err)
      })
    }
  }

  const deleteReview = async () => {
    return await axios.post(port.url + '/review/delete', {
      shortId: cookies.userData.shortId,
      movieId:props.id
    })
  }

  return (
    <>
      {
        createIsOpen ? (
          <Create createIsOpen={createIsOpen} setCreateIsOpen={setCreateIsOpen} movieId={props.id} getReviewData={getReviewData}/>
        ) : (
          <>
            <div className="review-create-btn" onClick={()=>{
              if(!cookies.userData){
                alert('로그인을 해주세요')
              } else {
                setCreateIsOpen(true)
              }}}>
              <h2 className='white-xl-font'>Write Here!</h2>
            </div>
              {
                reviewData.map((item, index)=>(
                  <div key={index} className="review-card">
                    <div className="review-content">
                      <h1 className='white-big-font center'>{item.title}</h1>
                      <div className='right'>
                        <span className='grey-small-font m-3'>{item.star}</span>
                        <span className="star">
                          ★★★★★
                          <span style={{width: `${Number(item.star) * 10 * 2}%`}}>
                            ★★★★★
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="review-content">
                      <p className='white-small-font mb-4'>
                        {item.content}
                      </p>
                    </div>  
                    <div className='review-content'>
                      <div className='right'>
                        <p className='grey-small-font foot'>
                          {item.author}
                          <span className='white-small-font time-box'>
                            {item.createdAt}
                          </span>
                        </p>
                        {
                          cookies.userData && cookies.userData.shortId == item.shortId ? (
                            <>
                                <button type="button" className="button grey-button-small">
                                  UPDATE
                                </button>
                                <button type="button" className="button grey-button-small" onClick={()=>{onClickDeleteBtn()}}>
                                  DELETE
                                </button>
                            </>
                          ) : (<></>)
                        }
                      </div>
                    </div>
                  </div>
                ))
              }
          </>
        )
      }
    </>
    
  )
}

export default Reviews;