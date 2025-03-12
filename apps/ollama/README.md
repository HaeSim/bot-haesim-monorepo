# Ollama LLM 서비스

이 디렉토리는 Ollama LLM 서비스를 위한 Docker 설정을 포함합니다.

## 구성 요소

- `Dockerfile`: ARM64 기반 Ubuntu 환경에서 Ollama를 실행하기 위한 컨테이너 정의
- `ollama-entrypoint.sh`: Ollama 서비스 실행 스크립트
- `model/`: (선택사항) 로컬 모델 저장 디렉토리

## 포트

- Ollama API는 `11434` 포트로 노출됩니다.

## 기본 모델

- `huihui_ai/kanana-nano-abliterated`: 기본적으로 설치되는 2.1B 경량 모델