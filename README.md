# 🔐 Auth
인증, 사용자 관리를 담당하는 마이크로서비스입니다.

## 📦 프로젝트 구성
기본적인 구성은 MSA 공통 컨벤션을 준수하는 [nexon-assignment-nestjs-temp](https://github.com/argon1025/nexon-assignment-nestjs-temp)를 사용했습니다.

### 🗂 폴더 구조

```
📦src
 ┣ 📂common                           (공통 상수, enum, 예외 코드 등 재사용 가능한 요소)
 ┣ 📂schema                           (Mongoose 스키마 정의 모음)
 ┣ 📂user                             (User 도메인의 전체 기능 모듈)
 ┃ ┣ 📂admin                          (관리자용 API 영역: 사용자 정보 수정)
 ┃ ┃ ┣ 📜user.controller.ts             (관리자용 유저 API 컨트롤러)
 ┃ ┃ ┗ 📜user.service.ts                (관리자용 유저 비즈니스 로직 처리)
 ┃ ┣ 📂internal                       (내부 서비스 API 영역: 회원가입, 로그인 등)
 ┃ ┃ ┣ 📜user.controller.ts             (내부 서비스용 유저 API 컨트롤러)
 ┃ ┃ ┗ 📜user.service.ts                (내부 서비스용 유저 비즈니스 로직 처리)
 ┃ ┣ 📂repository                     (UserRepository: DB 접근 로직 추상화 계층)
 ┃ ┃ ┣ 📜user.repository.interface.ts   (UserRepository 인터페이스 정의)
 ┃ ┃ ┗ 📜user.repository.ts             (Mongoose 기반 실제 구현체)
 ┃ ┗ 📜user.module.ts
 ┣ 📜app.module.ts
 ┗ 📜main.ts
```

### 🧠 설계 배경
#### 인증, 인가 책임 분리
- 사용자의 자격 증명(이메일/비밀번호 검증)과 JWT 발급 책임은 Auth 마이크로서비스가 담당합니다.
  - 해당 사용자가 유효한지
  - JWT 토큰의 서명, 만료 기간 페이로드 정책
- 사용자의 요청이 유효한지를 확인하는 책임은 Gateway 서비스가 담당합니다.
  - JWT의 유효성 및 서명 검증
  - 요청자가 해당 리소스에 접근 가능한 역할인지
#### Repository ↔ Service 간 명확한 책임 분리
- 변경에 유연한 구조를 만들기 위해, 각 레이어마다 인터페이스(IUserRepository, IUserService)를 정의하고, 이를 구현하는 형태로 설계했습니다.
- 각 계층은 자신의 관심사에만 집중할 수 있도록 에러 처리 또한 역할 기반으로 분리했습니다.
  - Repository → DB 예외를 의미 있는 NestJS 예외로 변환해 상위 레이어에 전달 (예: DB에러코드 E11000 → ConflictException)
  - Service -> 도메인 로직 판단 및 흐름 제어 시 발생하는 에러 처리 (이메일 중복, 비밀번호 불일치)
#### 권한에 따른 API 경로 분리
- 사용자와 관리자의 useCase가 명확히 구분되도록 API 경로를 역할 기준으로 분리했습니다.
  - /auth/user/internal/* → 일반 사용자: 회원가입, 로그인, 내 정보 조회
  - /auth/user/admin/* → 관리자: 유저 조회, 역할 변경 등 운영 기능

## 🚀 Docker-compose 로컬 개발환경 구성 가이드
이 프로젝트는 Docker Compose를 통해 단독으로 실행할 수 있도록 구성되어 있습니다.  
전체 MSA 환경을 통합 실행하고자 할 경우에는 [Event Reward System](https://github.com/argon1025/nexon-assignment) 저장소의 통합 실행 가이드를 참고하세요.

### 1. docker-compose 빌드
```bash
$ docker-compose build --build-arg NODE_ENV=docker
```
NestJS 애플리케이션과 MongoDB 이미지를 빌드합니다.  
이 빌드 과정은 최초 실행 또는 코드 변경 시에만 필요합니다.  
> 도커 환경변수는 프로젝트 내 `.env.docker` 에서 별도로 관리합니다.  

### 2. 컨테이너 실행
```bash
$ docker-compose up
```
> auth 서비스와 auth-mongo MongoDB 인스턴스를 함께 실행합니다.

### 3. 서비스 접근
- Auth swagger `http://localhost:8080/api`
- MongoDB `http://localhost:27017`

> ⚠️ 포트정보는 `Docker-compose` 파일 내 선언에 따라 변경될 수 있습니다.
