#!/bin/bash
set -e

echo "Ollama 모델 다운로더 시작..."

# 기본 모델 확인 (huihui_ai/kanana-nano-abliterated)
if ! ollama list | grep -q "huihui_ai/kanana-nano-abliterated"; then
  echo "기본 모델 다운로드 중: huihui_ai/kanana-nano-abliterated"
  ollama pull huihui_ai/kanana-nano-abliterated
else
  echo "기본 모델 이미 존재함, 다운로드 건너뜀"
fi

echo "모델 다운로드 완료" 