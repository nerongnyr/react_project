const WebSocket = require('ws');
const http = require('http');
const jwt = require('jsonwebtoken');
const db = require('../../db');
const JWT_SECRET = 'show_me_the_money'; // 실제 키와 일치시켜야 함

const clients = new Map(); // userId -> socket

function startWebSocketServer(app, port = 3006) {
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url?.split('?')[1]);
    const token = params.get('token');
    if (!token) return ws.close();

    try {
      const user = jwt.verify(token, JWT_SECRET);
      clients.set(user.id, ws);
      console.log(`🔌 WebSocket 연결됨: ${user.id}`);

      ws.on('close', () => {
        clients.delete(user.id);
        console.log(`❌ 연결 종료: ${user.id}`);
      });
    } catch (err) {
      console.error('JWT 오류:', err);
      ws.close();
    }
  });

  server.listen(port, () => {
    console.log(`WebSocket 서버 실행 중: ws://localhost:${port}`);
  });
}

// 실시간 알림 전송
function sendNotification(toUserId, notiData) {
  const ws = clients.get(toUserId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(notiData));
    console.log(`알림 전송: 사용자 ${toUserId}`);
  } else {
    console.warn(`사용자 ${toUserId}는 WebSocket에 연결되어 있지 않음`);
  }
}

module.exports = {
  startWebSocketServer,
  sendNotification
};
