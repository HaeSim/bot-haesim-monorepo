# Base image: Optimized Ollama with pre-installed models
FROM ollama/ollama:latest

# curl 설치 (헬스체크와 스크립트에 필요)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 실행 포트
EXPOSE 11434

# 모델 데이터 영구 저장을 위한 볼륨 설정
VOLUME /root/.ollama

# 환경 변수 설정
ENV OLLAMA_HOST="0.0.0.0:11434"
ENV OLLAMA_KEEP_ALIVE="-1"

# 헬스체크 설정
HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:11434/api/version || exit 1

# 모든 스크립트 추가
COPY download-models.sh ollama-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/download-models.sh /usr/local/bin/ollama-entrypoint.sh

# ollama-entrypoint.sh를 ENTRYPOINT로 설정
ENTRYPOINT ["/bin/sh", "-c", "/usr/local/bin/ollama-entrypoint.sh"]