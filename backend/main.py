from fastapi import FastAPI, WebSocket
from ultralytics import YOLO
import cv2
import base64

app = FastAPI()
model = YOLO("best_yolo_model_phone.pt")
cap = cv2.VideoCapture(0)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    if not cap.isOpened():
        await websocket.close()
        return

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            results = model(frame)
            annotated_frame = results[0].plot()
            _, buffer = cv2.imencode('.jpg', annotated_frame)
            frame_b64 = base64.b64encode(buffer).decode('utf-8')
            await websocket.send_text(frame_b64)

    except Exception as e:
        print("Error:", e)
    finally:
        cap.release()
        await websocket.close()
