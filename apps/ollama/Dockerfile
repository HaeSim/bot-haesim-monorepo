# Base image: Optimized Ollama with pre-installed models
FROM ollama/ollama:latest

# 실행 포트
EXPOSE 11434

# 모델 데이터 영구 저장을 위한 볼륨 설정
VOLUME /root/.ollama

# 환경 변수 설정
ENV OLLAMA_HOST="0.0.0.0:11434"
ENV OLLAMA_KEEP_ALIVE="-1"

# 헬스체크 설정
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:11434/api/version || exit 1

# 기본 모델 다운로드 스크립트 추가
COPY download-models.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/download-models.sh

# 기본 ENTRYPOINT 유지 (ollama serve)
# 시작 시 모델 다운로드 실행
CMD /usr/local/bin/download-models.sh && ollama serve