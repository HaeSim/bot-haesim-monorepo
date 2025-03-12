/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * 웹엑스 봇 모니터링 차트 생성 JavaScript
 */
/* global document, Chart */
document.addEventListener('DOMContentLoaded', function () {
  // 차트 컨테이너 요소가 있는지 확인
  if (
    document.getElementById('eventChart') &&
    document.getElementById('resourceChart')
  ) {
    try {
      // 차트 데이터를 가져옴
      const eventBreakdownElement =
        document.getElementById('eventBreakdownData');
      const resourceBreakdownElement = document.getElementById(
        'resourceBreakdownData',
      );

      if (eventBreakdownElement && resourceBreakdownElement) {
        // JSON 데이터 파싱
        const eventBreakdown = /** @type {Record<string, number>} */ (
          JSON.parse(eventBreakdownElement.textContent || '{}')
        );
        const resourceBreakdown = /** @type {Record<string, number>} */ (
          JSON.parse(resourceBreakdownElement.textContent || '{}')
        );

        // 이벤트 차트 생성
        createEventChart(eventBreakdown);

        // 리소스 차트 생성
        createResourceChart(resourceBreakdown);
      }
    } catch (error) {
      console.error('차트 생성 중 오류 발생:', error);
    }
  }
});

/**
 * 이벤트 타입 차트 생성
 * @param {Record<string, number>} eventBreakdown
 */
function createEventChart(eventBreakdown) {
  const eventData = {
    labels: Object.keys(eventBreakdown),
    datasets: [
      {
        label: '이벤트 수',
        data: Object.values(eventBreakdown),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const eventCtx = /** @type {HTMLCanvasElement} */ (
    document.getElementById('eventChart')
  ).getContext('2d');

  new Chart(eventCtx, {
    type: 'pie',
    data: eventData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: '이벤트 타입별 분포',
        },
      },
    },
  });
}

/**
 * 리소스 타입 차트 생성
 * @param {Record<string, number>} resourceBreakdown
 */
function createResourceChart(resourceBreakdown) {
  const resourceData = {
    labels: Object.keys(resourceBreakdown),
    datasets: [
      {
        label: '리소스 수',
        data: Object.values(resourceBreakdown),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const resourceCtx = /** @type {HTMLCanvasElement} */ (
    document.getElementById('resourceChart')
  ).getContext('2d');

  new Chart(resourceCtx, {
    type: 'pie',
    data: resourceData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: '리소스 타입별 분포',
        },
      },
    },
  });
}
