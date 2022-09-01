# 영화 추천 커뮤니티 웹사이트 - 백엔드 


## :blush: 01. API 설계   
* Rule
    * Method tpye이 `get` 시, param 에 데이터 전송
    * `get` tpye에 data 넣고 싶을 시 param에 넣거나 post 로 변경하여 body에 넣고 전송



a. 유저 : /user 
|기능|Type|End point|Req|Res(success)|Res(Fail)|
|------|---|---|---|---|---|
|로그인|POST|/signUp|{ email: “lee@gmail.com”, password: “123”,}
|테스트3|테스트3|
|회원가입|POST|/signUp|테스트3|테스트3|테스트3|
|정보 조회|GET|/signUp|테스트3|테스트3|테스트3|
|유저 정보 수정|/signUp|테스트3|테스트3|테스트3|테스트3|
