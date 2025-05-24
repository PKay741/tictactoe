# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.responses import Response
from fastapi import Request
import asyncio
import random
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# # Mount the entire dist folder
# app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="frontend")

# # Serve the base index.html
# @app.get("/")
# def read_index():
#     return FileResponse("frontend/dist/index.html")

# #  Catch-all route (IMPORTANT)
# @app.get("/{full_path:path}")
# def catch_all(full_path: str):
#     file_path = os.path.join("frontend", "dist", "index.html")
#     return FileResponse(file_path)

# @app.get("/{full_path:path}")
# async def catch_all(request: Request, full_path: str):
#     if "." in full_path:
#         return Response(status_code=404)
#     return FileResponse("frontend/dist/index.html")



# @app.get("/{full_path:path}")
# async def serve_spa(full_path: str):
#     index_path = os.path.join("frontend", "dist", "index.html")
#     if os.path.exists(index_path):
#         return FileResponse(index_path)
#     return Response(status_code=404)

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



        # Mount the entire dist folder
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="frontend")

# # ✅ Serve actual static files
# app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")
# app.mount("/vite.svg", StaticFiles(directory="frontend/dist"), name="vite-svg")


# # Serve the base index.html
# @app.get("/")
# def read_index():
#     return FileResponse("frontend/dist/index.html")

# #  Catch-all route (IMPORTANT)
# @app.get("/{full_path:path}")
# def catch_all(full_path: str):
#     file_path = os.path.join("frontend", "dist", "index.html")
#     return FileResponse(file_path)


