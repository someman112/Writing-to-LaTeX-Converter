import { useEffect, useRef, useState } from "react";
import styles from './App.module.css';
import Latex from "react-latex";
import { fetchResponse } from "./api";

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
    context.lineWidth = 6;
    contextRef.current = context;
  }, []);

  const beginDrawing = (e) => {
    const { x, y } = e.nativeEvent;
    const relativeOffset = canvasRef.current.getBoundingClientRect();
    contextRef.current.beginPath();
    contextRef.current.moveTo(x - relativeOffset.left, y - relativeOffset.top);
    contextRef.current.lineTo(x - relativeOffset.left, y - relativeOffset.top);
    contextRef.current.stroke();
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

  const resetCanvas = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); 
  };

  const createRequest = async () => {
    const response = await fetchResponse();
    parseMessage(response);
  }

  const parseMessage = (response) => {
    
  }

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        onMouseDown={beginDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      />
      <table>
        <tr><input type="submit" name="process" value="process here" onClick={createRequest} /></tr>
        <tr><input type="submit" name="process" value="reset" onClick={resetCanvas}/></tr>
      </table>
      <Latex>What is $(3\times 4) \div (5-3)$</Latex>
    </div>
  );
}

export default App;
