import { useEffect, useRef, useState } from "react";
import styles from './App.module.css';
import Latex from "react-latex";
import { fetchResponse } from "./api";
import 'katex/dist/katex.min.css';
import { PulseLoader } from "react-spinners";

function App() {
  const canvasRef = useRef();
  const contextRef = useRef();

  const [isDrawing, setIsDrawing] = useState(false);
  const [latexContent, setLatexContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    const context = canvas.getContext("2d");
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineCap = "round";
    context.lineJoin = 'bevel';
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
    // contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    contextRef.fillStyle = 'white';
    contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setLatexContent("");
  };

  const createRequest = async () => {
    setLoading(true);
    try {
      const data = canvasRef.current.toDataURL("image/png", 1.0);
      const image_data = data.split(",")[1];
      const response = await fetchResponse(image_data);
      parseMessage(response);
    } finally {
      setLoading(false);
    }

  }

  const parseMessage = (response) => {
    console.log(response);
    setLatexContent(`$${response}$`);

  }

  return (
      <div className="App">
        <h2>ScribbleTeX</h2>
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
        {
        loading ? 
        <PulseLoader 
          color="#36d7b7" 
          loading={loading}
          size={10}  
        />
        : 
        <div className={styles.Latex}>
          <Latex>{latexContent}</Latex>
          <p>
            {latexContent}
          </p>
        </div>
        }
      </div>
  );
}

export default App;
