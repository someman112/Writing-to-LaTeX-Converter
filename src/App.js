import { useEffect, useRef, useState } from "react";
import styles from './App.module.css';
import Latex from "react-latex";
import { fetchResponse } from "./api";
import 'katex/dist/katex.min.css';
import { PulseLoader } from "react-spinners";
import { CopyBlock, dracula } from "react-code-blocks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons/faEraser';
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil';
import titleImage from './title.png';
import logoImage from './logo.png'

function App() {
  const canvasRef = useRef();
  const contextRef = useRef();

  const [isDrawing, setIsDrawing] = useState(false);
  const [latexContent, setLatexContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(false);
  const [eraserColor, setEraserColor] = useState("#ffffff");
  const [pencilColor, setPencilColor] = useState("#ffffff");


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
    setRequest(false);
  };

  const createRequest = async () => {
    setLoading(true);
    setRequest(true);
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
    const reg = /\\\[|\\\]/g;
    const reg2 = /^```latex|```$/g
    response = response.replace(reg, "");
    response = response.replace(reg2, "");

    if(response.includes("sorry")){
      setLatexContent("$N/A$");
    }
    else{
      setLatexContent(`$${response}$`);
    }

  }

  const eraser = () => {
    setEraserColor("rgb(148,255,243)");
    setPencilColor("rgb(255,255,255)");
    contextRef.current.strokeStyle = "white";
    contextRef.current.lineWidth = 11;
  }

  const pencil = () => {
    setEraserColor("rgb(255,255,255)");
    setPencilColor("rgb(148,255,243)");
    contextRef.current.strokeStyle = "black";
    contextRef.current.lineWidth = 6;
  }

  return (
      <div className="App">
        <h2> <img src={titleImage} alt={"title"} className={styles.title}/></h2>
        <img src={logoImage} alt="Logo" className={styles.logo} />
        <canvas
            ref={canvasRef}
            onMouseDown={beginDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
        />
        <div className="buttons">

        </div>
        <table>
          <tr><input type="submit" name="process" value="Convert!" onClick={createRequest} /></tr>
          <tr><input type="submit" name="process" value="Reset" onClick={resetCanvas}/></tr>
          <tr className={styles.buttonContainer}>
            <td className={styles.buttonIcon} onClick={eraser}>
              <FontAwesomeIcon id="eraser" icon={faEraser} style={{ color: eraserColor }}  />
            </td>
            <td className={styles.buttonIcon} onClick={pencil}>
              <FontAwesomeIcon id="pencil" icon={faPencil} style={{ color: pencilColor }}  />
            </td>
          </tr>
        </table>


        {
        loading ? 
        <PulseLoader 
          color="#36d7b7" 
          loading={loading}
          size={10}  
        />
        : 
        request ? <div className={styles.Latex}>
          <div className={styles.LatexOut}>
          <Latex>{latexContent}</Latex>
          </div>
          <div className={styles.LatexCode}>
          <CopyBlock
            language="go"
            text={latexContent}
            codeBlock
            theme={dracula}
            showLineNumbers={false}
            customStyle={{ fontSize: '15px', padding: '27.5px'}}
          />
          </div>
        </div> : ""
        }
      </div>
  );
}

export default App;
