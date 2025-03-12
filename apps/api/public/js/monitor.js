/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * 웹엑스 봇 모니터링 대시보드 JavaScript
 */
/* global document */
document.addEventListener('DOMContentLoaded', function () {
  console.log('모니터링 대시보드 로드됨');

  // 자동 새로고침 기능 (30초마다)
  setupAutoRefresh();

  // 각종 이벤트 핸들러 설정
  setupEventHandlers();

  // 룸 행 클릭 이벤트 설정
  setupRoomRowEvents();

  // 다크 모드 감지 및 적용
  setupDarkModeDetection();
});

/**
 * 30초마다 페이지를 자동으로 새로고침하는 기능
 */
function setupAutoRefresh() {
  const AUTO_REFRESH_INTERVAL = 30 * 1000; // 30초
  let refreshTimer;

  // 타이머 시작
  startRefreshTimer();

  function startRefreshTimer() {
    refreshTimer = setInterval(() => {
      updateDashboardData();
    }, AUTO_REFRESH_INTERVAL);
  }

  // 페이지가 백그라운드로 갔을 때 타이머 중지
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      clearInterval(refreshTimer);
    } else {
      startRefreshTimer();
      // 페이지가 다시 보일 때 즉시 데이터 업데이트
      updateDashboardData();
    }
  });

  console.log('자동 새로고침 설정됨 (30초마다)');
}

/**
 * Ajax를 통해 최신 데이터를 가져와 대시보드 업데이트
 */
function updateDashboardData() {
  // 새로고침 버튼에 로딩 표시
  const refreshButton = document.getElementById('refreshButton');
  if (refreshButton) {
    const originalText = refreshButton.textContent;
    refreshButton.innerHTML = '<span class="loading"></span> 업데이트 중...';
    refreshButton.disabled = true;
  }

  fetch('/webex/monitor/api/stats')
    .then((response) => {
      if (!response.ok) {
        throw new Error('API 응답 오류');
      }
      return response.json();
    })
    .then((data) => {
      console.log('대시보드 데이터 업데이트됨:', data);

      // 데이터 요소 업데이트
      updateDashboardElements(data);

      // 차트 데이터 업데이트 및 재생성
      if (data.eventBreakdown && data.resourceBreakdown) {
        document.getElementById('eventBreakdownData').textContent =
          JSON.stringify(data.eventBreakdown);
        document.getElementById('resourceBreakdownData').textContent =
          JSON.stringify(data.resourceBreakdown);

        // 차트 재생성 함수 호출 (chart-generator.js에 있는 함수)
        if (
          typeof createEventChart === 'function' &&
          typeof createResourceChart === 'function'
        ) {
          createEventChart(data.eventBreakdown);
          createResourceChart(data.resourceBreakdown);
        }
      }

      // 룸 테이블 업데이트
      if (data.activeRooms) {
        updateRoomsTable(data.activeRooms);
      }

      // 새로고침 버튼 원래대로 복원
      if (refreshButton) {
        refreshButton.textContent = '수동 새로고침';
        refreshButton.disabled = false;
      }

      // 업데이트 성공 알림
      showToast('데이터가 성공적으로 업데이트되었습니다.');
    })
    .catch((error) => {
      console.error('대시보드 데이터 업데이트 실패:', error);

      // 새로고침 버튼 원래대로 복원
      if (refreshButton) {
        refreshButton.textContent = '수동 새로고침';
        refreshButton.disabled = false;
      }

      // 오류 알림
      showToast('데이터 업데이트 실패: ' + error.message, 'error');
    });
}

/**
 * 대시보드 요소 업데이트
 * @param {Object} data - API에서 받은 데이터
 */
function updateDashboardElements(data) {
  // 봇 상태 업데이트
  if (data.botStatus) {
    // 온라인 상태 업데이트
    const statusElement = document.querySelector('.badge');
    if (statusElement) {
      if (data.botStatus.isOnline) {
        statusElement.className = 'badge bg-success';
        statusElement.textContent = '온라인';
      } else {
        statusElement.className = 'badge bg-danger';
        statusElement.textContent = '오프라인';
      }
    }

    // 통계 수치 업데이트
    updateElementText('마지막 활동', formatDate(data.botStatus.lastActivity));
    updateElementText('총 웹훅 로그', data.botStatus.totalWebhookLogs);
    updateElementText('총 메시지', data.botStatus.totalMessages);
  }

  // 웹훅 로그 테이블 업데이트
  if (data.recentWebhookLogs) {
    updateWebhookLogsTable(data.recentWebhookLogs);
  }

  // 메시지 테이블 업데이트
  if (data.recentMessages) {
    updateMessagesTable(data.recentMessages);
  }
}

/**
 * 룸 테이블 업데이트
 * @param {Array} rooms - 룸 목록
 */
function updateRoomsTable(rooms) {
  if (!rooms || !Array.isArray(rooms)) return;

  // 룸 테이블 찾기
  const roomsCard = document.querySelector('.card-header h5');
  let tableBody = null;

  if (roomsCard && roomsCard.textContent.includes('현재 접속 중인 룸')) {
    tableBody = roomsCard.closest('.card').querySelector('tbody');
  }

  if (!tableBody) return;

  // 테이블 헤더 업데이트 (룸 개수 표시)
  roomsCard.textContent = `현재 접속 중인 룸 (${rooms.length})`;

  // 테이블 내용 비우기
  tableBody.innerHTML = '';

  // 새 데이터로 테이블 채우기
  rooms.forEach((room) => {
    const row = document.createElement('tr');
    row.className = 'room-row';
    row.setAttribute('data-room-id', room.id);

    row.innerHTML = `
      <td>${truncateText(room.id, 10)}</td>
      <td>${room.title}</td>
      <td>${room.type}</td>
      <td>${formatDate(room.created)}</td>
      <td>${formatDate(room.lastActivity)}</td>
    `;

    tableBody.appendChild(row);
  });

  // 룸 행 이벤트 다시 설정
  setupRoomRowEvents();
}

/**
 * 웹훅 로그 테이블 업데이트
 * @param {Array} logs - 웹훅 로그 목록
 */
function updateWebhookLogsTable(logs) {
  if (!logs || !Array.isArray(logs)) return;

  // 웹훅 로그 테이블 찾기
  const webhookCard = document.querySelector('.card-header h5');
  let tableBody = null;

  if (webhookCard && webhookCard.textContent.includes('최근 웹훅 로그')) {
    tableBody = webhookCard.closest('.card').querySelector('tbody');
  }

  if (!tableBody) return;

  // 테이블 내용 비우기
  tableBody.innerHTML = '';

  // 새 데이터로 테이블 채우기
  logs.forEach((log) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${log.webhookId}</td>
      <td>${log.eventType}</td>
      <td>${log.resourceType}</td>
      <td>${formatDate(log.createdAt)}</td>
    `;

    tableBody.appendChild(row);
  });
}

/**
 * 메시지 테이블 업데이트
 * @param {Array} messages - 메시지 목록
 */
function updateMessagesTable(messages) {
  if (!messages || !Array.isArray(messages)) return;

  // 메시지 테이블 찾기
  const messageCards = document.querySelectorAll('.card-header h5');
  let tableBody = null;

  for (const card of messageCards) {
    if (card.textContent.includes('최근 메시지')) {
      tableBody = card.closest('.card').querySelector('tbody');
      break;
    }
  }

  if (!tableBody) return;

  // 테이블 내용 비우기
  tableBody.innerHTML = '';

  // 새 데이터로 테이블 채우기
  messages.forEach((message) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${message.ID}</td>
      <td>${message.TEXT}</td>
      <td>${message.userId}</td>
      <td>${message.roomId}</td>
      <td>${formatDate(message.createdAt)}</td>
    `;

    tableBody.appendChild(row);
  });
}

/**
 * 요소의 텍스트 내용 업데이트
 * @param {string} title - 요소의 제목
 * @param {string|number} value - 업데이트할 값
 */
function updateElementText(title, value) {
  const elements = document.querySelectorAll('.card-body h6');
  for (const element of elements) {
    if (element.textContent === title) {
      const valueElement = element.nextElementSibling;
      if (valueElement) {
        valueElement.textContent = value;
      }
      break;
    }
  }
}

/**
 * 날짜 형식화 함수
 * @param {string} dateString - 날짜 문자열
 * @returns {string} 형식화된 날짜
 */
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR');
}

/**
 * 텍스트 길이 제한 함수
 * @param {string} text - 원본 텍스트
 * @param {number} length - 최대 길이
 * @returns {string} 잘린 텍스트
 */
function truncateText(text, length) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * 룸 행 클릭 이벤트 설정
 */
function setupRoomRowEvents() {
  const roomRows = document.querySelectorAll('.room-row');

  roomRows.forEach((row) => {
    row.addEventListener('click', function () {
      const roomId = this.getAttribute('data-room-id');
      if (roomId) {
        showRoomDetails(roomId);
      }
    });
  });
}

/**
 * 룸 상세 정보 표시
 * @param {string} roomId - 룸 ID
 */
function showRoomDetails(roomId) {
  // 여기에 룸 상세 정보를 가져와서 모달로 표시하는 코드를 추가할 수 있습니다
  console.log(`룸 ID ${roomId}의 상세 정보 표시`);

  // 예시: 알림 표시
  showToast(`룸 ID: ${roomId}의 상세 정보를 조회합니다.`);
}

/**
 * 이벤트 핸들러 설정
 */
function setupEventHandlers() {
  // 수동 새로고침 버튼이 있다면 이벤트 등록
  const refreshButton = document.getElementById('refreshButton');
  if (refreshButton) {
    refreshButton.addEventListener('click', function () {
      updateDashboardData();
    });
  }
}

/**
 * 다크 모드 감지 및 적용
 */
function setupDarkModeDetection() {
  // 시스템 다크 모드 감지
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

  // 초기 다크 모드 설정
  if (prefersDarkMode.matches) {
    document.body.classList.add('dark-mode');
  }

  // 다크 모드 변경 감지
  prefersDarkMode.addEventListener('change', (e) => {
    if (e.matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
}

/**
 * 토스트 메시지 표시
 * @param {string} message - 표시할 메시지
 * @param {string} type - 메시지 타입 (success, error, warning, info)
 */
function showToast(message, type = 'success') {
  // 이미 있는 토스트 제거
  const existingToast = document.querySelector('.toast-container');
  if (existingToast) {
    existingToast.remove();
  }

  // 토스트 컨테이너 생성
  const toastContainer = document.createElement('div');
  toastContainer.className =
    'toast-container position-fixed bottom-0 end-0 p-3';
  toastContainer.style.zIndex = '5';

  // 토스트 요소 생성
  const toastEl = document.createElement('div');
  toastEl.className = `toast show bg-${type === 'error' ? 'danger' : type}`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');

  // 토스트 내용 생성
  toastEl.innerHTML = `
    <div class="toast-header">
      <strong class="me-auto">알림</strong>
      <small>${new Date().toLocaleTimeString()}</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body text-white">
      ${message}
    </div>
  `;

  // 토스트를 컨테이너에 추가
  toastContainer.appendChild(toastEl);

  // 컨테이너를 문서에 추가
  document.body.appendChild(toastContainer);

  // 닫기 버튼 이벤트 등록
  const closeButton = toastEl.querySelector('.btn-close');
  if (closeButton) {
    closeButton.addEventListener('click', function () {
      toastContainer.remove();
    });
  }

  // 3초 후 자동으로 사라지게 설정
  setTimeout(() => {
    if (document.body.contains(toastContainer)) {
      toastContainer.remove();
    }
  }, 3000);
}
