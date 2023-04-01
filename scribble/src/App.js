import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'


function App() {
  var rect, isDown, origX, origY;
  const { editor, onReady } = useFabricJSEditor()
  const [canvas, setCanvas] = useState("");


  return (
    <>
    <div className="controls">
    <button id="select" type="button" onClick="changeAction(this)">select</button>
    <button id="erase" type="button" onClick="changeAction(this)">erase</button>
    <button id="undo" type="button" onClick="changeAction(this)">undo erasing</button>
    <button id="draw" type="button" onClick="changeAction(this)">draw</button>
    <button id="spray" type="button" onClick="changeAction(this)">spray</button>
    <button id="rectangle" type="button" onClick="changeAction(this)">rectangle</button>
</div>
<div>
    <div>
        <label for="a">
            background image <code>erasable</code>
        </label>
        <input id="a" type="checkbox" onChange="setBgImageErasableProp(this)" />
    </div>
    <div>
        <label for="b">
            remove erased objects on <code>erasing:end</code>
        </label>
        <input id="b" type="checkbox" onChange="setErasingRemovesErasedObjects(this)" />
    </div>
</div>
<div>
    <button type="button" onClick="toJSON()">toJSON</button>
    <button type="button" onClick="downloadImage()">to Image</button>
    <button type="button" onClick="downloadSVG()">toSVG</button>
</div>
<div style={{display:"flex",flexDirection:"row"}}>
    <div>
        <canvas id="c" width="500" height="620"></canvas>
    </div>
    <div style={{margin:"0 1rem"}}>
        <code>erasing:end</code><br />
        <code id="output">N/A</code>
    </div>
    <script src="main.js"></script>
</div>
    </>

  );
}

export default App;
