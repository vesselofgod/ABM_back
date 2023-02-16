# ABM_backend component
---
## 💡 기능
ourB는 취미 기반의 유저 매칭 서비스로 다음과 같은 기능들을 지원하고 있다.

 - 전체적인 기능에 대한 UI outline은 아래의 XD를 통해 확인할 수 있다.
 - **[기능 보기](https://xd.adobe.com/view/8cd76f98-f4e2-4b65-98dc-7de299e81dc4-d984/grid)**

 
## ✅ 구성 안내
 - backend의 개발 환경은 window11, node v18.12.1에서 진행되었다.
 
 - 데이터베이스로는 mongoDB를 사용하고 있으며, 각각의 schema에 대한 정보는 model 폴더에서 확인할 수 있다.
 
 - test data는 data 폴더에서 확인할 수 있으며, 데이터 초기화는 mongodb shell을 설치한 이후 window의 경우 ABM_back component에서 ```set_data.bat```을 실행하고, 이외의 mac, linux의 경우 ```set_data.sh``` 를 실행해서 초기화 할 수 있다.
 
 - backend API 문서는 backend component를 실행하고, ```http://localhost:3000/api-docs``` URL에서 확인할 수 있다.
 
 - API 문서 자동화가 되어있는데, ABM_back component에서 node ./gen_swagger.js를 하면 자동으로 API 문서가 생성된다.
 
 - 다만 코드를 보고 간략하게 자동작성을 하기에 기존 API 문서에서 diff를 확인해서 추가하도록 하자.
 
 - 백엔드 자체적으로 데이터 검증/테스트를 할 경우에는 POSTMAN을 주로 사용하여 테스트하였고, front-end와의 연동하여 테스트를 할 경우에는 front component도 실행하여 에뮬레이터에서 테스트하였다.

 
## ⚡️ 설치/실행 안내 (Installation/Run Process)
- ```git clone https://github.com/vesselofgod/ABM_back.git```를 활용해서 backend component를 다운로드 받는다.

- backend component의 설치가 완료되었으면 ```npm install```을 통해서 backend 개발에 필요한 dependency를 설치한다.

- ```node index.js```를 통해서 backend component를 실행한다.

- open web browser and connect ```localhost:3000```

- frontend component를 실행하고 싶다면 마찬가지로 ```git clone``` 을 이용해서 해당 컴포넌트를 설치하고 dependency와 안드로이드 에뮬레이터를 설치한 다음 frontend component 폴더에서 ```flutter run```을 통해서 실행할 수 있다.

- 프론트엔드 설정은 다음 링크를 참고하자. https://fre2-dom.tistory.com/175

## ⚙ 기술 스택 (Technique Used)

- ### Back-end
Node.js | S3 |socket.io | mongoDB
:---: | :---: | :---: | :---: 
![nodejs](https://user-images.githubusercontent.com/18081105/135970378-9d7cf78a-4fa6-41a3-87a9-1c675bb092c1.jpg) | ![img](https://user-images.githubusercontent.com/18081105/219286409-1fbe0c2f-423b-484c-8824-b711dd27d9e3.png) | ![socket io_icon-removebg-preview](https://user-images.githubusercontent.com/18081105/140266703-6500647c-e218-4177-af8d-4cd336c1eb29.png) | ![MongoDB-sm-logo-500x400-1-1](https://user-images.githubusercontent.com/18081105/219281784-1246645c-be55-44f4-ac65-6432a79f764c.jpg)

 
## 🔧 프로젝트 관리 (Project Management)
 - [개발 일정(Develop Schedule)](https://trello.com/b/G0ujlCcU/main)
 - [Class Diagram](https://github.com/vesselofgod/WebRTC_HIPAA_Compliance/wiki/Class-Diagram)
 - [프로젝트 XD](https://xd.adobe.com/view/8cd76f98-f4e2-4b65-98dc-7de299e81dc4-d984)
