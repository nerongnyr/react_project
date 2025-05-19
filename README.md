
![rm](https://github.com/user-attachments/assets/e48c73c6-a0f4-48e6-9220-7e287197661f)
## 💡 프로젝트 소개
인스타그램의 주요 기능을 클론하여 만든 SNS 웹 애플리케이션입니다.
React + Node.js + MySQL 기반으로 개발되었으며, 사용자 인증, 게시물 등록/수정/삭제, 댓글, 팔로우, 알림, 채팅 등 핵심 기능을 구현했습니다.

## 📅 개발 기간

- **05/08 ~ 05/15**
  - 프로젝트 기획 구상, DB설계, 서비스 개발, 테스트 및 수정

## 🛠 사용 언어 및 기술 스택

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📑 페이지별 기능

### 1. 로그인 및 회원가입

![aaa](https://github.com/user-attachments/assets/45effaf4-b575-4975-8b9e-250fa74f4b76)
![aaaa](https://github.com/user-attachments/assets/018dad97-213e-4720-bb18-6fd40c6f7894)

- 로그인 및 회원가입 기능은 JWT(Json Web Token)를 활용한 인증 방식으로 구현하였습니다.  
- 비밀번호는 bcrypt를 사용하여 안전하게 암호화되어 데이터베이스에 저장됩니다.  
- 회원가입 시 사용자명, 이메일, 비밀번호 등을 입력받아 계정을 생성합니다.  
- 로그인 시 발급된 JWT는 localStorage에 저장되어 인증이 필요한 페이지 접근 시 활용됩니다.

### 2. 메인 페이지

![rmm](https://github.com/user-attachments/assets/84db7e03-487d-47f7-867a-7f037f82be7a)
![bbbbbbb](https://github.com/user-attachments/assets/48cf2416-f84a-4279-91eb-072267e20716)
![c](https://github.com/user-attachments/assets/d7ddeef5-602d-4c6c-ab57-ff1504207a22)

- 최신 게시물이 피드 형식으로 렌더링됩니다.
- 게시물에는 이미지 슬라이드, 좋아요, 댓글, 북마크, 수정/삭제 등의 기능이 포함되어 있습니다.
- 왼쪽 사이드바를 통해 메시지, 알림, 프로필, 게시물 작성, 더보기 등으로 이동할 수 있습니다.

### 3. 게시물 등록

![bb](https://github.com/user-attachments/assets/2c059fea-8746-4440-b06d-8961d92a0b44)

- 게시물 등록은 모달 형태로 구성되어 있으며, 사용자는 이미지를 업로드하고 텍스트를 작성해 게시물을 등록할 수 있습니다.
- 이미지는 미리보기 형태로 보여지며, 삭제 후 다시 업로드할 수도 있습니다.  
- 등록된 게시물은 메인 페이지 피드에 실시간으로 반영되며, 작성자 정보와 함께 저장됩니다.  
- 입력 데이터는 FormData를 사용하여 서버로 전송되며, 서버에서는 multer를 활용해 이미지 파일을 저장합니다.

### 4. 게시물 댓글 및 상세보기 모달

![rmmm](https://github.com/user-attachments/assets/7ac52100-a658-4e9c-a0c7-6c4997a19211)

- 댓글을 클릭하면 전체 화면에 모달로 게시물 상세 내용을 표시합니다.  
- 좌측에는 게시물 이미지(슬라이드), 우측에는 작성자 정보, 댓글 목록, 댓글 입력창이 배치되어 있습니다.  
- 댓글은 실시간으로 반영되며, 대댓글, 수정/삭제, 좋아요 등의 기능도 제공합니다.  
- 해당 모달은 뒤로가기 또는 닫기 버튼을 통해 언제든 종료할 수 있습니다.

### 5. 사용자 검색 기능

![aaaaa](https://github.com/user-attachments/assets/5e54eb3c-5639-4a1a-8b50-dffcde7eccb7)

- 검색 기능은 사이드바의 '검색' 탭을 통해 접급할 수 있습니다.
- 입력창에 키워드를 입력하면 해당 문자열이 포함된 사용자 목록이 실시간으로 표시됩니다.  
- 최근 검색한 사용자 기록은 리스트 형식으로 표시되며, 필요시 개별 삭제도 가능합니다.  
- 검색된 사용자를 클릭하면 해당 프로필 페이지로 바로 이동할 수 있습니다.
- 클릭된 사용자는 최근 검색 기록에 저장됩니다.

### 6. 메시지(채팅) 기능

![aaaaaa](https://github.com/user-attachments/assets/f195815b-b0fe-4d8d-b68c-f3e69aa99d43)

- 메시지 기능은 실시간 양방향 1:1 채팅을 지원하며, Socket를 통해 구현되었습니다.  
- 좌측에는 채팅 참여자 목록이 표시되며, 대화 상대를 클릭하면 우측에 해당 대화 내용이 출력됩니다.  
- 각 메시지에는 발신 시간, 말풍선 스타일, 송수신자 구분이 적용되어 있습니다. 
- 채팅방 생성은 '새 메시지' 버튼을 통해 사용자를 선택 후 바로 시작할 수 있습니다.

### 7. 알림 기능

![b](https://github.com/user-attachments/assets/15af97fd-d48d-4555-998d-d288e00b68ef)

- 알림 기능은 WebSocket을 활용하여 실시간으로 처리되며, 댓글 작성, 좋아요 등 사용자 간 상호작용이 발생할 때마다 해당 이벤트가 수신자에게 즉시 전달됩니다.  
- 알림은 사이드 패널 형태로 제공됩니다
- 각 알림에는 관련된 사용자 정보와 발생 시간이 함께 표시되어 직관적인 알림 관리를 지원합니다.

### 8. 마이페이지 (프로필 화면)

![bbb](https://github.com/user-attachments/assets/9bcb73ad-c9d7-4727-9e38-73766309e09c)
![bbbb](https://github.com/user-attachments/assets/0d0a143d-9d56-483c-8f47-5bfb4e9d410f)
![bbbbb](https://github.com/user-attachments/assets/402b4e4c-09a8-47d4-a787-853dc606e303)

- 마이페이지는 사용자의 프로필 정보와 게시물 활동을 한눈에 확인할 수 있는 공간입니다.  
- 사용자는 프로필 이미지를 등록하고, 소개글을 자유롭게 수정할 수 있으며, 작성한 게시물 수, 팔로워 및 팔로잉 수가 실시간으로 표시됩니다.  
- 탭을 통해 작성한 게시물과 저장한 게시물을 구분해 볼 수 있으며, 썸네일을 클릭하면 게시물 상세 페이지로 이동됩니다.
- 팔로잉 목록은 모달 형태로 구현되어, 사용자가 팔로우한 유저들을 확인하고 검색할 수 있도록 구성했습니다.  
- 각 목록에는 사용자 프로필 이미지, 닉네임, 이름이 표시되며, '팔로잉' 버튼을 눌러 언팔로우도 가능합니다.  

### 9. 다른 사용자 프로필 페이지

![bbbbbb](https://github.com/user-attachments/assets/cf42dafb-d237-41a1-bbdb-43ff04bbecd5)

- 다른 사용자의 프로필 페이지에서는 해당 유저의 기본 정보(닉네임, 프로필 사진, 소개글 등)와 함께 작성한 게시물들을 확인할 수 있습니다.  
- 현재 로그인한 사용자는 이 페이지에서 팔로우/언팔로우 버튼을 통해 상호작용할 수 있으며, 버튼 상태는 실시간으로 반영됩니다.  
- 사용자가 업로드한 게시물은 썸네일 형식으로 나열되며, 클릭 시 상세 페이지로 진입합니다.

## 🧾 프로젝트 후기

이번 SNS 프로젝트를 통해 프론트엔드와 백엔드를 연동하며 전체적인 웹 서비스의 흐름을 이해할 수 있었습니다.  
모든 기능을 구현하면서 실제 서비스와 유사한 구조를 경험해볼 수 있어서 좋은 경험이었습니다

처음에는 JWT 인증이나 WebSocket과 같은 기술이 익숙하지 않아 어려움을 겪었지만, 에러 로그들을 반복적으로 확인하며 문제를 해결해 나가면서 많은 성장을 하였다는 생각이 들었습니다
다음에는 모바일 반응형 구현, 알림 페이지 클릭 시 해당 게시물로 자동 이동, 스토리/릴스 기능 확장 등 여러기능들을 추가해보고 싶다고 생각했습니다
이 프로젝트를 통해 문제 해결 능력을 키울 수 있었던 좋은 경험이었습니다
