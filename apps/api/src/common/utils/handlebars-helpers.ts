/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as hbs from 'hbs';
import * as Handlebars from 'handlebars';

/**
 * Handlebars 템플릿 엔진에 사용자 정의 헬퍼 함수를 등록합니다.
 */
export function registerHandlebarsHelpers(): void {
  // hbs 모듈에서 handlebars 인스턴스 가져오기
  const handlebars = hbs.handlebars as typeof Handlebars;

  // 날짜 형식화 헬퍼
  handlebars.registerHelper(
    'formatDate',
    function (date: Date | string | null) {
      if (!date) return '-';
      const dateObj = new Date(date);
      return dateObj.toLocaleString('ko-KR');
    },
  );

  // 텍스트 길이 제한 헬퍼
  handlebars.registerHelper(
    'truncateText',
    function (text: string, length: number) {
      if (!text) return '';
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    },
  );

  // JSON 문자열화 헬퍼
  handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });
}
