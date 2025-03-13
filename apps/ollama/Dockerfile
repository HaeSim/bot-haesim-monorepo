# Base image: Optimized Ollama with pre-installed models
FROM ollama/ollama:latest

# 실행 포트
EXPOSE 11434

# 자주 사용하는 모델 사전 설치 - 빌드 시간은 증가하지만 배포 및 실행 시간 대폭 감소
RUN ollama pull llama2 && \
    ollama pull mistral && \
    ollama pull llava:latest

# 모델 데이터 영구 저장을 위한 볼륨 설정
VOLUME /root/.ollama

# 실행 스크립트 복사
COPY ollama-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/ollama-entrypoint.sh

# 헬스체크 개선 - 더 빠른 간격으로 점검
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:11434/api/version || exit 1

# 컨테이너 실행 시 Ollama 서버 시작
CMD ["ollama-entrypoint.sh"]