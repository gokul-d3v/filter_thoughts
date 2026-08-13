import http from 'k6/http';
import ws from 'k6/ws';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp up to 50 users
    { duration: '1m', target: 50 },  // Stay at 50 users for 1 min
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
};

const BASE_URL = 'http://localhost:8080/api/v1';
const WS_URL = 'ws://localhost:8080/api/v1/ws';

export default function () {
  // 1. Create a session (anonymous login)
  const res = http.post(`${BASE_URL}/sessions`);
  check(res, { 'status was 200 or 201': (r) => r.status === 200 || r.status === 201 });
  
  if (res.status !== 200 && res.status !== 201) {
    return;
  }

  // Extract session cookie automatically handled by k6
  const roomId = 'global';

  // 2. Connect to WebSocket
  const wsRes = ws.connect(WS_URL, null, function (socket) {
    socket.on('open', function () {
      socket.send(JSON.stringify({
        type: 'join_room',
        payload: { room_id: roomId }
      }));

      // Send a test message
      socket.send(JSON.stringify({
        type: 'message',
        payload: { room_id: roomId, content: 'Hello from k6 load test!' }
      }));
    });

    socket.on('message', function (msg) {
      // Just receive it
    });

    // Close after 10 seconds of simulated activity
    socket.setTimeout(function () {
      socket.send(JSON.stringify({
        type: 'leave_room',
        payload: { room_id: roomId }
      }));
      socket.close();
    }, 10000);
  });

  check(wsRes, { 'websocket connected successfully': (r) => r && r.status === 101 });
  sleep(1);
}
