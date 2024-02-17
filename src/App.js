import { useEffect, useRef, useState } from "react";
import styles from './App.module.css';

function App() {
  const canvasRef = useRef();
  const contextRef = useRef();

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 500;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const beginDrawing = (e) => {
    const { x, y } = e.nativeEvent;
    const relativeOffset = canvasRef.current.getBoundingClientRect();
    contextRef.current.beginPath();
    contextRef.current.moveTo(x - relativeOffset.left, y - relativeOffset.top);
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    const { x, y } = e.nativeEvent;
    const relativeOffset = canvasRef.current.getBoundingClientRect();
    contextRef.current.lineTo(x - relativeOffset.left, y - relativeOffset.top);
    contextRef.current.stroke();
  };

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        onMouseDown={beginDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      />
    </div>
  );
}

export default App;
