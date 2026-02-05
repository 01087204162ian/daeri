#!/bin/bash

# daeri 배포 스크립트
# 사용법: ./deploy.sh

set -e

echo "🚀 daeri 배포 시작..."

# 최신 코드 가져오기
echo "📥 Git pull..."
git pull origin main

# 의존성 설치
echo "📦 의존성 설치..."
npm install

# 빌드
echo "🔨 빌드 중..."
npm run build

# PM2 재시작
echo "🔄 서버 재시작..."
pm2 restart daeri || pm2 start npm --name "daeri" -- start

echo "✅ 배포 완료!"
echo "📊 서버 상태 확인: pm2 status"
echo "📝 로그 확인: pm2 logs daeri"
