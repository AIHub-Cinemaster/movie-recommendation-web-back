import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import $ from "jquery";
import port from "./../components/data/port.json";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./../assets/css/Login.css";
import kakaoLogin from "./../assets/images/kakaoLogin.png";
import googleLogin from "./../assets/images/googleLogin.png";
import naverLogin from "./../assets/images/naverLogin.png";

const Login = () => {
  useEffect(() => {
    $(".message span").click(function () {
      $("form").animate({ height: "toggle", opacity: "toggle" }, "slow");
    });
  }, []);
  // $( document ).ready( function(){
  //   $('.message a').click(function(){
  //     $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
  //   });
  // })

  //----------------------------- 공통 -----------------------------//
  const [isSignUp, setSignUp] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["userData"]);

  //----------------------------- 로그인 -----------------------------//
  const [inErrorMessage, setInErrorMessage] = useState("");
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const onClickLoginButton = () => {
    if (signInData.email === "") {
      alert("이메일을 입력해주세요.");
      $("#email").focus();
      return;
    }

    if (signInData.password === "") {
      alert("패스워드를 입력해주세요.");
      $("#password").focus();
      return;
    }

    sendSignInData()
      .then((res) => {
        console.log("res", res.data);
        setCookie("userData", res.data, { path: "/" });
        alert("로그인이 완료되었습니다.");
        navigate("/");
        window.location.reload();//헤더-프로필 이미지 불러오려면 새로고침 필요함
      })
      .catch((e) => {
        console.log(e);
        setInErrorMessage(e.response.data.fail);
      })
      .finally(() => {
        // console.log("final", cookies.userData);
      });
  };

  // 로그인 data를 입력받는 함수
  const onChangeSignInData = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  const sendSignInData = async () => {
    // console.log(signInData);
    return await axios.post(port.url + "/user/login", signInData);
  };

  //----------------------------- 회원가입 -----------------------------//
  const [upErrorMessage, setUpErrorMessage] = useState("");
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    rePassword: "",
    name: "",
  });

  const onClickSignUpButton = () => {
    // console.log(signUpData);
    if (signUpData.email === "") {
      alert("이메일을 입력해주세요.");
      $("#emailUp").focus();
      return;
    }

    if (signUpData.password === "") {
      alert("패스워드를 입력해주세요.");
      $("#passwordUp").focus();
      return;
    }

    if (signUpData.rePassword === "") {
      alert("확인 패스워드를 입력해주세요.");
      $("#rePasswordUp").focus();
      return;
    }

    if (signUpData.name === "") {
      alert("이름을 입력해주세요.");
      $("#nameUp").focus();
      return;
    }

    if (signUpData.password !== signUpData.rePassword) {
      alert("비밀번호와 확인 비밀번호가 같지 않습니다.");
      setSignUpData({
        ...signUpData,
        password: "",
        rePassword: "",
      });
      $("#passwordUp").focus();
      return;
    }

    ///////////// 프로필 이미지
    let formData = new FormData();
    const profileImg = $("#profile_input")[0].files[0];
    const config = {
      header: { "Content-Type": "multipart/form-data" },
    };

    formData.append("file", profileImg);
    formData.append("name", signUpData.name);
    formData.append("email", signUpData.email);
    formData.append("password", signUpData.password);

    //// fromData 내부 데이터 로그 확인용
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    // onChangeSignUpProfileImg(profileImg);

    sendSignUpData(formData, config)
      .then((res) => {
        alert(res.data.result);
        window.location.reload(); 
      })
      .catch((e) => {
        setUpErrorMessage(e.response.data.error);
      });
  };

  const sendSignUpData = async (formData, config) => {
    // console.log("signUpdaata");
    return await axios.post(`${port.url}/user/signUp`, formData, config);
  };

  // 회원가입 data를 입력받는 함수
  const onChangeSignUpData = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  //----------------------------- 프로필 이미지 -----------------------------//
  const [profileImage, setProfileImage] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
  );
  const fileInput = useRef(null);

  const onChangeProfileImg = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      console.log(e.target.files[0]);
    } else {
      //업로드 취소할 시
      // setProfileImage(
      //   "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
      // );
      return;
    }
    //화면에 프로필 사진 표시
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  //----------------------------- kakao oauth -----------------------------//
  const REST_API_KEY = "eb0d9d031d9fc9784711b4d3f038fecb";
  const REDIRECT_URI = "http://localhost:3001/oauth/kakao/callback";

  // 카카오연동 1번
  const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  //----------------------------- naver oauth -----------------------------//
  const NAVER_CLIENT_ID = "g7l8PXOSnPcSuI_Ocrpx";
  const NAVER_CLIENT_SECRET = "XRngCKMBae";
  const NAVER_REDIRECT_URI = "http://localhost:3001/oauth/naver/callback";
  const STATE = "RAMDOM_STATE";
  // 네이버연동 1번
  const NAVER_AUTH_URI = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${STATE}`;

  return (
    <>
      {cookies.userData ? (
        <>{/* <button onClick={()=>{navigate('/')}}>test</button> */}</>
      ) : (
        <div className="login-page">
          <div className="form">
            {/* 로그인 */}
            <form className="login-form">
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Email"
                value={signInData.email}
                onChange={onChangeSignInData}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={onChangeSignInData}
                name="password"
                id="password"
                value={signInData.password}
              />
              <p className="warning-text">{inErrorMessage}</p>
              <button type="button" onClick={onClickLoginButton}>
                login
              </button>
              {/* <button onClick={()=>{navigate('/')}}>test</button> */}

              <p className="message">
                Not registered?{" "}
                <span>
                  <strong>Create an account</strong>
                </span>
              </p>

              <div className="social-container">
                <a href={NAVER_AUTH_URI} className="social">
                  <img src={naverLogin} width="50px" />
                </a>
                <a href="#" className="social">
                  <img src={googleLogin} width="50px" />
                </a>
                <a href={KAKAO_AUTH_URI} className="social">
                  <img src={kakaoLogin} width="50px" />
                </a>
              </div>
            </form>

            {/* 회원가입 */}
            <form className="register-form">
              <img
                alt="User Picture"
                src={profileImage}
                id="profile-image"
                onClick={() => {
                  fileInput.current.click();
                }}
                height="240"
              />
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/jpg,image/png,image/jpeg"
                name="profile_input"
                id="profile_input"
                onChange={onChangeProfileImg}
                ref={fileInput}
              />
              <input
                id="emailUp"
                name="email"
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={onChangeSignUpData}
              />
              <input
                id="passwordUp"
                name="password"
                type="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={onChangeSignUpData}
              />
              <input
                id="rePasswordUp"
                name="rePassword"
                type="password"
                placeholder="re-Password"
                value={signUpData.rePassword}
                onChange={onChangeSignUpData}
              />
              <input
                id="nameUp"
                name="name"
                type="text"
                placeholder="Name"
                value={signUpData.name}
                onChange={onChangeSignUpData}
              />
              <p className="warning-text">{upErrorMessage}</p>
              <button type="button" onClick={onClickSignUpButton}>
                Sign Up
              </button>
              <p className="message">
                Already registered?{" "}
                <span>
                  <strong>Sign In</strong>
                </span>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
