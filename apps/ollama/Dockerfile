# Base image: ARM64 Ubuntu + Ollama
FROM ubuntu:24.04

# 필수 패키지 설치
RUN apt update && apt install -y \
    curl wget git \
    python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Ollama 설치 (ARM64 지원)
RUN curl -fsSL https://ollama.com/install.sh | sh

# 실행 포트
EXPOSE 11434

# 실행 스크립트 복사
COPY ollama-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/ollama-entrypoint.sh

# 컨테이너 실행 시 Ollama 서버 시작
CMD ["ollama-entrypoint.sh"]