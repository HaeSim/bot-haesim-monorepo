# Base image: Optimized Ollama with pre-installed models
FROM ollama/ollama:latest

# 실행 포트
EXPOSE 11434

# 필요한 모델만 사전 설치
RUN ollama pull huihui_ai/kanana-nano-abliterated

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