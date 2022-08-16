import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import port from "./data/port.json";
import MyProfile from "./pages/user/MyProfile";
import MyWishList from "./pages/user/MyWishList";
import MyWrittenList from "./pages/user/MyWrittenList";

const API_KEY = process.env.REACT_APP_API_KEY;

const MyPage = () => {
  const [wishList, setWishList] = useState([]);
  var wishListTemp = []; //임시저장

  useEffect(() => {
    getCartList()
      .then((res) => {
        //찜영화의 아이디만 담긴 배열
        res.data.result.map((item) => {
          //아이디 하나씩 넣어서
          getMovieInfoById(item)
            .then((res) => {
              // 정보를 가져온다.
              wishListTemp.push(res.data); //객체를 임시배열에 담는다
            })
            .catch((err) => {
              console.log(err);
            });
        });
        setWishList(wishListTemp); //반복문이 종료되면 위시리스트에 저장
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // cart DB에서 내 목록 가져오기 (only id)
  const getCartList = async () => {
    return await axios.get(`${port.url}/cart/list/${cookies.userData.shortId}`);
  };

  // 무비 아이디를 넣어서 해당영화의 정보 가져오기
  const getMovieInfoById = async (movie_id) => {
    return await axios.get(
      `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${API_KEY}&language=en-US`
    );
  };

  const [cookies, setCookie, removeCookie] = useCookies(["userData"]);
  const [view, setView] = useState({
    profile: true,
    wishlist: false,
    writtenlist: false,
  });

  return (
    <>
      {cookies.userData ? (
        <>
          <h1>{cookies.userData.name}님의 마이페이지</h1>
          <button
            onClick={() => {
              setView({
                profile: true,
                wishlist: false,
                writtenlist: false,
              });
            }}
            className="btn btn-primary"
          >
            Profile
          </button>

          <button
            onClick={() => {
              if (wishList.length === 0) {
                alert("위시리스트가 비어있습니다.");
                return;
              }
              setView({
                profile: false,
                wishlist: true,
                writtenlist: false,
              });
            }}
            className="btn btn-primary"
          >
            Wish List
          </button>

          <button
            onClick={() => {
              setView({
                profile: false,
                wishlist: false,
                writtenlist: true,
              });
            }}
            className="btn btn-primary"
          >
            Written List
          </button>

          {view.profile ? <MyProfile /> : <></>}
          {view.wishlist ? <MyWishList wishList={wishList} /> : <></>}
          {view.writtenlist ? <MyWrittenList /> : <></>}
        </>
      ) : (
        <>로그인이 필요합니다.</>
      )}
    </>
  );
};

export default MyPage;
