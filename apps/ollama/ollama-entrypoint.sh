#!/bin/bash

# Ollama 서버를 백그라운드로 시작
ollama serve &
OLLAMA_PID=$!

# 서버가 시작될 때까지 대기
echo "Ollama 서버 시작 중..."
sleep 5

# 모델 다운로드 시도
echo "모델 다운로드 중: huihui_ai/kanana-nano-abliterated"
ollama pull huihui_ai/kanana-nano-abliterated

# 서버 프로세스가 종료되면 컨테이너도 종료되도록 대기
wait $OLLAMA_PID