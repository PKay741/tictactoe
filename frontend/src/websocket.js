// let socket;

// export function connectWebSocket(roomId, onMessage) {
//   socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

//   socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     onMessage(data);
//   };
// }

// export function sendMessage(message) {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify(message));
//   }
// }

// export function closeWebSocket() {
//   if (socket) socket.close();
// }

let socket;

export function connectWebSocket(roomId, onMessage) {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.host;
  socket = new WebSocket(`${protocol}://${host}/ws/${roomId}`);

  // socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
}

export function sendMessage(message) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

export function closeWebSocket() {
  socket?.close();
}
