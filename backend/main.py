# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rooms = {}

def check_winner(board):
    lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # cols
        [0, 4, 8], [2, 4, 6],             # diagonals
    ]
    for a, b, c in lines:
        if board[a] and board[a] == board[b] == board[c]:
            return board[a]  # return "X" or "O"
    if all(cell != "" for cell in board):
        return "draw"
    return None


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()

    if room_id not in rooms:
        rooms[room_id] = []

    rooms[room_id].append(websocket)

     # Send assigned symbol
    symbol = "X" if len(rooms[room_id]) == 1 else "O"
    await websocket.send_json({"type": "assign_symbol", "symbol": symbol})

    try:
        while True:
            data = await websocket.receive_json()
            vs_ai = data.get("vsAI", False)

            if vs_ai:
                # Basic AI: choose random empty cell
                board = data.get("board", [])
                result = check_winner(board)

                if result is not None:
                    continue  # Game already over, do not respond
                empty_cells = [i for i, cell in enumerate(board) if cell == ""]
                if empty_cells:
                    await asyncio.sleep(0.8)  # Add this delay to simulate thinking
                    ai_move = random.choice(empty_cells)
                    await websocket.send_json({"type": "ai_move", "index": ai_move})
            else:
                # Relay to other players
                for conn in rooms[room_id]:
                    if conn != websocket:
                        await conn.send_json(data)

    except WebSocketDisconnect:
        rooms[room_id].remove(websocket)
