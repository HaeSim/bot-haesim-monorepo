import axios from 'axios';

// API URL 설정
// 클라이언트 사이드에서는 /api/v1을, 서버 사이드에서는 직접 API 서비스 URL을 사용
const API_URL = typeof window === 'undefined' 
  ? (process.env.API_SERVER_URL || 'http://api:8080') // 서버 사이드
  : (process.env.NEXT_PUBLIC_API_URL || '/api/v1');  // 클라이언트 사이드

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 모니터링 데이터 가져오기 (기존 /webex/monitor/api/stats 엔드포인트 사용)
export const fetchMonitoringStats = async () => {
  try {
    const response = await api.get('/webex/monitor/api/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching monitoring stats:', error);
    throw error;
  }
};

export default api;