#!/bin/bash
set -e

echo "Ollama 모델 다운로더 시작..."

# Ollama 서버가 시작될 때까지 대기
max_attempts=60
attempt=0
echo "Ollama 서버 시작 대기 중..."

while ! curl -s http://localhost:11434/api/version > /dev/null; do
  attempt=$((attempt+1))
  if [ $attempt -ge $max_attempts ]; then
    echo "시간 초과: Ollama 서버 시작 실패"
    exit 1
  fi
  echo "Ollama 서버 대기 중... ($attempt/$max_attempts)"
  sleep 2
done

echo "Ollama 서버 시작됨!"

# 기본 모델 확인 (huihui_ai/kanana-nano-abliterated)
if ! ollama list | grep -q "huihui_ai/kanana-nano-abliterated"; then
  echo "기본 모델 다운로드 중: huihui_ai/kanana-nano-abliterated"
  ollama pull huihui_ai/kanana-nano-abliterated
else
  echo "기본 모델 이미 존재함, 다운로드 건너뜀"
fi

echo "모델 다운로드 완료!"

# 백그라운드에서 모델 로드 (사용 준비)
echo "모델 로드 중..."
ollama run huihui_ai/kanana-nano-abliterated "hello" > /dev/null 2>&1 &

echo "Ollama 설정 완료"

# 스크립트 종료 - 메인 프로세스는 계속 실행 