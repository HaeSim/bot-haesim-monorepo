#!/bin/bash
set -e

# Ollama 서버 시작 방식 변경
echo "Ollama 서버 시작 (최적화 모드)"
exec ollama serve &

# 모델 다운로드 스크립트 실행
echo "모델 다운로드 프로세스 시작"
/usr/local/bin/download-models.sh

# 메인 프로세스 유지
tail -f /dev/null