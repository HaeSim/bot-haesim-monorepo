import axios from 'axios';

// API URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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