/**
 * Webex Bot 프레임워크에서 사용하는 @webex/internal-media-core 패키지의
 * navigator 문제를 해결하기 위한 패치 파일입니다.
 */

// navigator는 읽기 전용이므로 직접 설정하지 않고 필요한 속성만 모킹
// global.navigator = global.navigator || ({} as Navigator); // 이 줄 제거

// 필요한 navigator 속성을 Object.defineProperty로 추가
if (!global.navigator) {
  Object.defineProperties(global, {
    navigator: {
      value: {
        userAgent: 'node.js',
        appName: 'Node.js',
        platform: process.platform,
        // 필요한 다른 navigator 속성 추가
      },
      configurable: true,
    },
  });
}

// screen 객체 추가
global.screen =
  global.screen ||
  ({
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1080,
    colorDepth: 24,
    pixelDepth: 24,
    orientation: {
      type: 'landscape-primary',
      angle: 0,
      // ScreenOrientation 인터페이스에 필요한 메서드 추가
      onchange: null,
      unlock: () => Promise.resolve(),
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    } as ScreenOrientation,
  } as Screen);

// location 객체 추가
global.location =
  global.location ||
  ({
    protocol: 'https:', // 안전한 프로토콜 사용
    hostname: 'localhost',
    port: '',
    href: 'https://localhost/',
    host: 'localhost',
    pathname: '/',
    origin: 'https://localhost',
    search: '',
    hash: '',
    // Location 인터페이스에 필요한 메서드 추가
    ancestorOrigins: {} as DOMStringList,
    assign: () => {},
    reload: () => {},
    replace: () => {},
  } as Location);

// window 객체에 필요한 타이머 메서드 추가
global.window =
  global.window ||
  ({
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    location: global.location, // location 객체 연결
    screen: global.screen, // screen 객체 연결
    navigator: global.navigator, // navigator 객체 연결
    // 필요한 경우 추가 메서드 구현
  } as Window & typeof globalThis);

// 이 패치는 최신 Node.js 버전에서 navigator 속성이 읽기 전용일 때
// Webex 프레임워크가 정상 작동하도록 합니다.
