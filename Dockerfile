# syntax=docker/dockerfile:1
ARG NODE_VERSION=18.20.8

# -----------------
# 1) Base Stage
# -----------------
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

# pnpm 설치 (package.json 에 명시된 버전 사용)
RUN corepack enable

# -----------------
# 2) deps Stage
# 프로덕션 의존성만 설치합니다.
# -----------------
FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --prod

# -----------------
# 3) Build Stage
# 전체 의존성을 설치하고 프로젝트를 빌드합니다.
# -----------------
FROM deps AS build

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
 
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

COPY . .
RUN rm -rf .env*
COPY .env.${NODE_ENV} ./
RUN pnpm run build

# -----------------
# 4) Final Stage
# 프로덕션 모듈, 빌드 결과물을 복사하고 실행 가능한 이미지를 생성합니다.
# -----------------
FROM base AS final

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/.env.${NODE_ENV} ./.env.${NODE_ENV}

EXPOSE 8080
ENTRYPOINT [ "node", "dist/main" ]