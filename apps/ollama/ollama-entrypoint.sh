#!/bin/bash
set -e

# 최적화된 Ollama 서버 시작 - 성능 튜닝 파라미터 추가
ollama serve &
OLLAMA_PID=$!

# 서버가 완전히 시작될 때까지 대기 (병렬 처리를 통한 시간 단축)
echo "Ollama 서버 시작 중..."
start_time=$(date +%s)
until curl -s http://localhost:11434/api/version > /dev/null; do
  current_time=$(date +%s)
  elapsed_time=$((current_time - start_time))
  # 30초 이상 지나면 타임아웃으로 간주
  if [ $elapsed_time -gt 30 ]; then
    echo "Ollama 시작 타임아웃. 로그를 확인하세요."
    exit 1
  fi
  echo "Ollama 아직 준비되지 않음 - 대기 중... (${elapsed_time}초 경과)"
  sleep 2
done
echo "Ollama 서버 준비 완료! (시작 시간: $(($(date +%s) - start_time))초)"

# 환경에서 요청한 추가 모델 다운로드 (기본 모델은 이미지에 포함됨)
if [ -n "$OLLAMA_MODELS" ]; then
  echo "추가 모델 다운로드 확인 중..."
  IFS=',' read -ra MODELS <<< "$OLLAMA_MODELS"
  
  # 병렬 모델 다운로드 - 최대 2개 모델 동시 다운로드
  for model in "${MODELS[@]}"; do
    # 이미 존재하는 모델은 다시 다운로드하지 않음
    if ! ollama list | grep -q "$model"; then
      echo "모델 다운로드 중: $model"
      ollama pull "$model" &
      # 최대 2개 모델까지 병렬 다운로드
      background_count=$(jobs -p | wc -l)
      if [ $background_count -ge 2 ]; then
        wait -n  # 작업 하나가 완료될 때까지 대기
      fi
    else
      echo "모델 $model 이미 존재함, 다운로드 건너뜀"
    fi
  done
  
  # 모든 다운로드 완료 대기
  wait
  echo "모든 요청된 모델 준비 완료!"
fi

# 기본 모델 확인 (huihui_ai/kanana-nano-abliterated)
if ! ollama list | grep -q "huihui_ai/kanana-nano-abliterated"; then
  echo "기본 모델 다운로드 중: huihui_ai/kanana-nano-abliterated"
  ollama pull huihui_ai/kanana-nano-abliterated
else
  echo "기본 모델 이미 존재함, 다운로드 건너뜀"
fi

# 메모리 최적화 설정 (사용 가능한 시스템 메모리에 따라 조정)
TOTAL_MEM=$(free -m 2>/dev/null || echo "8000" | awk '{print $2}')
if [ $TOTAL_MEM -gt 8000 ]; then
  echo "고용량 메모리 환경으로 최적화 (${TOTAL_MEM}MB 사용 가능)"
  export OLLAMA_CUDA_STREAM_SIZE=24
elif [ $TOTAL_MEM -gt 4000 ]; then
  echo "중간 용량 메모리 환경으로 최적화 (${TOTAL_MEM}MB 사용 가능)"
  export OLLAMA_CUDA_STREAM_SIZE=16
else
  echo "저용량 메모리 환경으로 최적화 (${TOTAL_MEM}MB 사용 가능)"
  export OLLAMA_CUDA_STREAM_SIZE=8
fi

# 프로세스 유지를 위해 Ollama 프로세스 포그라운드로 전환
echo "Ollama 서버가 최적화된 설정으로 실행 중. Ctrl+C로 중지하세요."
wait $OLLAMA_PID