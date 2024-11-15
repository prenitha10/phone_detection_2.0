import React, { useEffect, useState } from 'react';

function App() {
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8001/ws");
    socket.onmessage = (event) => {
      const imgSrc = `data:image/jpeg;base64,${event.data}`;
      setFrame(imgSrc);
    };
    socket.onclose = () => console.log("WebSocket connection closed");
    return () => socket.close();
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold text-center mb-6">
          Real-Time Phone Detection
        </h1>
        <p className="text-medium justify-left">A real time phone detection using YOLO v8 Model</p>
        {frame ? (
          <img src={frame} alt="YOLOv8 Detection" className="rounded shadow-lg" />
        ) : (
          <p className="text-center text-gray-500">Waiting for webcam stream...</p>
        )}
        <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Phone Detection System. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;
