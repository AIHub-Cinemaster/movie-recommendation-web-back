# 영화 추천 커뮤니티 웹사이트 - 백엔드 


## :blush: 01. API 설계   
* Rule
    * Method tpye이 `get` 시, param 에 데이터 전송
    * `get` tpye에 data 넣고 싶을 시 param에 넣거나 post 로 변경하여 body에 넣고 전송



a. 유저 : /user 
|기능|Type|End point|Req|Response|
|------|---|---|---|---|
|로그인|POST|/signUp|`{ email: String, password: String,}`|`{result :“회원가입이 완료되었습니다”}`|
|회원가입|POST|/signUp|`{email: String, password:String, name: String,}`|`{result:"회원가입이 완료되었습니다.""}`|
|정보 조회|GET|/:shortId|-|`{"_id": String,"email":String,"name": String,"type": String(local, naver, kakao),"profileImg": String,"shortId": String,"createdAt": DateTime,"updatedAt": DateTime,"__v": Number`}|
|유저 정보 수정|POST|/update|`{shortId: String,password: String, name: String, type: String(lcaol, naver, kakao),}`|`{result: "유저 정보가 수정되었습니다.”}`|

b. 영화 북마크 : /cart
|기능|Type|End point|Req|Response|
|------|---|---|---|---|
|북마크 조회|GET|/list/:shortId|-|`{empty: Boolean, result: List(String)}`|
|북마크 등록 및 삭제|POST|/toggle|`{ShortId: String, MovieId: String,}`|` {bookmark: true,result: "찜 목록에 '추가' 되었습니다."}; {bookmark: false,result: "찜 목록에서 '삭제' 되었습니다",}`|

c. 영화 평점 : /star
|기능|Type|End point|Req|Response|
|------|---|---|---|---|
|별점 조회|GET|/list/:shortId|-|`{empty: Boolean, result: List(String)}`|
|별점 등록 및 수정|POST|/add|`{shortId: String, movieId:String, star: Number,}`|` {data: List(Number), result: "별점 목록에 추가 되었습니다.",}`|
|영화별 평균 별점|GET|/average/:movieId|-|`{movieId: String,result: Number}`|

d. 영화 리뷰
d-1. 전체 리뷰 : /reviewlist
|기능|Type|End point|Req|Response|
|------|---|---|---|---|
|리뷰 조회|GET|/:movieId|-|`[{"title":String,"content":String,"author":String,"createdAt":Datetime,"updatedAt":Datetime,]`|

d-2. 유저 별 리뷰 : /review
|기능|Type|End point|Req|Response|
|------|---|---|---|---|
|유저별 리뷰  조회|GET|/user/:shortId|-|`[{“movieId”: String,“reviewId”: String, “shortId”: String, “author”: String, “profileImg”: String, “title”: String, “content”: String, “star”: String, “createdAt”: Datetime, “updatedAt”: Datetime, “likeCount”: Number}]`|
|작성된 리뷰 조회|GET|/find/:shortId/:reviewId|-|`[{“movieId”: String,“reviewId”: String, “shortId”: String, “author”: String, “profileImg”: String, “title”: String, “content”: String, “star”: String, “createdAt”: Datetime, “updatedAt”: Datetime, “likeCount”: Number}]`|
|리뷰 작성|POST|/add|`{“shortId”: String,“movieId”: String, “title”: String, “content”: String, “genreList” : List(String)}`|`{result: “리뷰가 작성되었습니다.”}`|
|리뷰 수정|POST|/update|`{“shortId”: String,“movieId”: String,“title”: String,“content”: String,}`|`{result: “리뷰가 수정되었습니다.”}`|
|리뷰 삭제|POST|/delete|`{“shortId”: String,“movieId”: String}`|`{result: “리뷰가 삭제되었습니다.”}`|

e. 리뷰 좋아요 : /like
|기능|Type|End point|Req|Response|
|------|---|---|---|---|
|좋아요 생성 및 삭제|POST|/|`{“shortId”: String, “reviewId”: String}`|`{“shortId”: String,“reviewId”: String,“like”: Boolean,“likeCount”: Number
}`|

f. 평가하기 : /eval
|기능|Type|End point|Req|Response|
|------|---|---|---|---|
|평가할 데이터 랜덤 조회|GET|/:movieCount|-|`{movieNum : Number, "result": List(Number)}`|
|평가한 데이터 입력|POST|/|`{"shortId" : String, "movieId" : String, ”star” : Number}`|`{"data": List(Object("movieId":String, "star":Number, "_id":String), ”result” : "별점 목록에 없던 영화라 추가 되었습니다.”}`|
