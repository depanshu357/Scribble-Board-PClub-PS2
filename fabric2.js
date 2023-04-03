var rect, isDown, origX, origY;
const canvas = (this.__canvas = new fabric.Canvas("c"));
canvas.statefullCache = true;
canvas.dirty = true;
setInterval(() => {
  var selectedObject = canvas.getActiveObject();
  if (selectedObject) {
    // An object is selected
    // console.log(selectedObject);
  } else {
    // No object is selected
  }
}, 1000);

drawingColorEl = document.getElementById("drawing-color");
drawingColorEl.onchange = function () {
  var brush = canvas.freeDrawingBrush;
  brush.color = this.value;
  console.log("changed")
  // fillValue = this.value;
  //   if (brush.getPatternSrc) {
  //     brush.source = brush.getPatternSrc.call(brush);
  //   }
};
var fillValue;
var drawingColorFillEl = document.getElementById("drawing-color-fill");
drawingColorFillEl.onchange = function(){
    fillValue = this.value;
}

function onMouseDownRectangle(o) {
  // console.log(selectedObject);
  isDown = true;
  var pointer = canvas.getPointer(o.e);
  origX = pointer.x;
  origY = pointer.y;
  var pointer = canvas.getPointer(o.e);
  canvas.isDrawingMode = false;
  rect = new fabric.Rect({
    left: origX,
    top: origY,
    originX: "left",
    originY: "top",
    width: pointer.x - origX,
    height: pointer.y - origY,
    angle: 0,
    stroke:canvas.freeDrawingBrush.color,
    // fill: "rgba(255,0,0,0.5)",
    fill: fillValue,
    transparentCorners: false,
  });
  canvas.add(rect);
}
function onMouseMoveRectangle(o) {
  if (!isDown) return;
  // cosoe
  var pointer = canvas.getPointer(o.e);
  canvas.isDrawingMode = false;
  if (origX > pointer.x) {
    rect.set({ left: Math.abs(pointer.x) });
  }
  if (origY > pointer.y) {
    rect.set({ top: Math.abs(pointer.y) });
  }
  rect.set({ width: Math.abs(origX - pointer.x) });
  rect.set({ height: Math.abs(origY - pointer.y) });
  canvas.renderAll();
}
function onMouseUpRectangle(o) {
  isDown = false;
  isDrawingMode = true;
}
function onMouseDownCircle(o) {
  isDown = true;
  var pointer = canvas.getPointer(o.e);
  origX = pointer.x;
  origY = pointer.y;
  canvas.isDrawingMode = false;
  circle = new fabric.Circle({
    left: origX,
    top: origY,
    originX: "left",
    originY: "top",
    radius: pointer.x - origX,
    angle: 0,
    fill: fillValue,
    stroke: canvas.freeDrawingBrush.color,
    strokeWidth: 3,
  });
  canvas.add(circle);
}
function onMouseMoveCircle(o) {
  if (!isDown) return;
  var pointer = canvas.getPointer(o.e);
  canvas.isDrawingMode = false;
  var radius =
    Math.max(Math.abs(origY - pointer.y), Math.abs(origX - pointer.x)) / 2;
  if (radius > circle.strokeWidth) {
    radius -= circle.strokeWidth / 2;
  }
  circle.set({ radius: radius });
  if (origX > pointer.x) {
    circle.set({ originX: "right" });
  } else {
    circle.set({ originX: "left" });
  }
  if (origY > pointer.y) {
    circle.set({ originY: "bottom" });
  } else {
    circle.set({ originY: "top" });
  }
  canvas.renderAll();
}
function onMouseUpCircle(o) {
  isDown = false;
  isDrawingMode = true;
}
var tri;
function onMouseDownTriangle(o){
  isDown = true;
  canvas.isDrawingMode = false;
  var pointer = canvas.getPointer(o.e);
  origX = pointer.x;
  origY = pointer.y;
  tri = new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    strokeWidth: 1,
    width:2,height:2,
    stroke: canvas.freeDrawingBrush.color,
    fill:fillValue,
    selectable: true,
    originX: 'center'
  })
  canvas.add(tri)
}
function onMouseMoveTriangle(o){
  if (!isDown) return;
  canvas.isDrawingMode = false;
  var pointer = canvas.getPointer(o.e);
    tri.set({ width: Math.abs(origX - pointer.x),height: Math.abs(origY - pointer.y)});
    // console.log("isMoving")
  canvas.renderAll();
}
function onMouseUpTriangle(o){
  isDown = false;
  canvas.isDrawingMode = true;
}


var marq_rect, marqer;
function onMouseDownClip(o){
  isDown = true;
    canvas.set({ 'selection': false });
    var pointer = canvas.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;
  canvas.isDrawingMode = false;

    var pointer = canvas.getPointer(o.e);
    marq_rect = new fabric.Rect({
        left: origX,
        top: origY,
        originX: 'left',
        originY: 'top',
        width: pointer.x - origX,
        height: pointer.y - origY,
        angle: 0,
        fill: 'transparent',
        stroke: 'black',
        strokeDashArray: [2, 2],
        strokeDashOffset: 20,
        strokeWidth: 2,
        transparentCorners: false,
        id: 'marq_rect'
      });
      canvas.add(marq_rect);
}
function onMouseMoveClip(o){
  if (!isDown) return;
  var pointer = canvas.getPointer(o.e);
  canvas.isDrawingMode = false;


  if (origX > pointer.x) {
      marq_rect.set({ left: Math.abs(pointer.x) });
  }
  if (origY > pointer.y) {
      marq_rect.set({ top: Math.abs(pointer.y) });
  }

  marq_rect.set({ width: Math.abs(origX - pointer.x) });
  marq_rect.set({ height: Math.abs(origY - pointer.y) });
  
  canvas.requestRenderAll();
}
function onMouseUpClip(o){
  isDown = false;
  canvas.isDrawingMode = true;
     canvas.set({ 'selection': true });
    //  canvas.clipPath = marq_rect;
    //  bg_image.clipPath = marq_rect;
  canvas.requestRenderAll();
}

let erasingRemovesErasedObjects = false;
drawingLineWidthEl = document.getElementById("drawing-line-width");
drawingLineWidthEl.onchange = function () {
  canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 30;
  this.previousSibling.innerHTML = this.value;
};

clearEl = document.getElementById("clear-canvas");
clearEl.onclick = function () {
  fcanvas.clear();
  console.log("clear button clicked")
};


 drawingShadowWidth = document.getElementById("drawing-shadow-width");
 drawingShadowOffset = document.getElementById("drawing-shadow-offset");
 drawingShadowColorEl = document.getElementById("drawing-shadow-color");
 
drawingShadowColorEl.onchange = function () {
  canvas.isDrawingMode = true

  canvas.statefullCache = true;

  canvas.freeDrawingBrush.shadowColor = this.value;
  console.log(canvas.freeDrawingBrush.shadowColor,"shadowColor")
};

drawingShadowWidth.onchange = function () {
      canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 30;
    this.previousSibling.innerHTML = this.value;
    console.log(canvas.freeDrawingBrush.shadowBlur)
//   console.log(this)
};
drawingShadowOffset.onchange = function () {
  canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 30;
  canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 30;
  this.previousSibling.innerHTML = this.value;
};

var hLinePatternBrush = new fabric.PatternBrush(canvas);
hLinePatternBrush.getPatternSrc = function () {
  var patternCanvas = fabric.document.createElement("canvas");
  patternCanvas.width = patternCanvas.height = 10;
  var ctx = patternCanvas.getContext("2d");

  ctx.strokeStyle = this.color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(5, 0);
  ctx.lineTo(5, 10);
  ctx.closePath();
  ctx.stroke();

  return patternCanvas;
};

(drawingOptionsEl = document.getElementById("drawing-mode-options")),
  (document.getElementById("drawing-mode-selector").onchange = function () {
    if (this.value === "hline") {
      canvas.freeDrawingBrush = vLinePatternBrush;
    } else if (this.value === "vline") {
      canvas.freeDrawingBrush = hLinePatternBrush;
    } else if (this.value === "square") {
      canvas.freeDrawingBrush = squarePatternBrush;
    } else if (this.value === "diamond") {
      canvas.freeDrawingBrush = diamondPatternBrush;
    } else if (this.value === "texture") {
      canvas.freeDrawingBrush = texturePatternBrush;
    }
    // else if (this.value === 'Calligraphy') {
    //     // canvas.freeDrawingBrush = new fabric['calligraphyBrush'](canvas)
    //     const calligraphyBrush = new fabric.CalligraphyBrush(canvas);
    //     // calligraphyBrush.color = "#000000"; // set color to black
    //     calligraphyBrush.width = 5; // set stroke width to 5 pixels
    //     console.log(clicked)

    //     canvas.isDrawingMode = true;
    //     canvas.freeDrawingBrush = calligraphyBrush;
    // }
    else if (this.value === "Marker") {
      const markerBrush = new fabric.MarkerBrush(canvas);
      markerBrush.color = "#000000"; // set color to black
      markerBrush.width = 20; // set stroke width to 20 pixels
      markerBrush.strokeLineCap = "round"; // set line cap to round

      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = markerBrush;
    } else {
      console.log(this.value);
      canvas.freeDrawingBrush = new fabric[this.value + "Brush"](canvas);

      if (canvas.freeDrawingBrush) {
        var brush = canvas.freeDrawingBrush;
        brush.color = drawingColorEl.value;
        if (brush.getPatternSrc) {
          brush.source = brush.getPatternSrc.call(brush);
        }
        brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        brush.shadow = new fabric.Shadow({
          blur: parseInt(drawingShadowWidth.value, 10) || 0,
          offsetX: 0,
          offsetY: 0,
          affectStroke: true,
          color: drawingShadowColorEl.value,
        });
      }
    }
  });

function changeAction(target) {

  canvas.off("mouse:down"); // remove all event listeners
  canvas.off("mouse:move");
  canvas.off("mouse:up");
  console.log(canvas)
  const types = [
    "select",
    "erase",
    "undo",
    "draw",
    "spray",
    "rectangle",
    "circle",
    "triangle",
    "clip",
  ];
  types.forEach((action) => {
    const t = document.getElementById(action);
    t.classList.remove("active");
  });
  if (typeof target === "string") target = document.getElementById(target);
  target.classList.add("active");
  switch (target.id) {
    case "select":
      canvas.isDrawingMode = false;
      break;
    case "fill":
      canvas.isDrawingMode = false;

      break;
    case "erase":
      canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
      canvas.freeDrawingBrush.width = 10;
      canvas.isDrawingMode = true;
      break;
    case "undo":
      canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
      canvas.freeDrawingBrush.width = 10;
      canvas.freeDrawingBrush.inverted = true;
      canvas.isDrawingMode = true;
      break;
    case "draw":
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 35;
      // canvas.freeDrawingBrush.color = "green";
      canvas.isDrawingMode = true;
      break;
    case "spray":
      canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
      canvas.freeDrawingBrush.width = 35;
      canvas.isDrawingMode = true;
      break;
    case "circle":
      canvas.on("mouse:down", onMouseDownCircle);
      canvas.on("mouse:move", onMouseMoveCircle);
      canvas.on("mouse:up", onMouseUpCircle);
      canvas.isDrawingMode = false;
      break;
    case "rectangle":
      // var rect, isDown, origX, origY;
      canvas.on("mouse:down", onMouseDownRectangle);
      canvas.on("mouse:move", onMouseMoveRectangle);
      canvas.on("mouse:up", onMouseUpRectangle);
      // function onObjectSelected(e) {
      //   console.log(e.target.get("type"));
      // }
      // canvas.on("object:selected", onObjectSelected);

      canvas.isDrawingMode = false;
      break;
    case "triangle":
      canvas.on("mouse:down",onMouseDownTriangle)
      canvas.on("mouse:move",onMouseMoveTriangle)
      canvas.on("mouse:up",onMouseUpTriangle)
      canvas.isDrawingMode = false;
      break;
    case "clip":
      canvas.on("mouse:down",onMouseDownClip)
      canvas.on("mouse:move",onMouseMoveClip)
      canvas.on("mouse:up",onMouseUpClip)
      canvas.isDrawingMode = false;
      break;
    default:
      break;
  }
}

function init() {
  // canvas.setOverlayColor("rgba(0,255,255,0.4)", undefined, { erasable: false });
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Set overlay blending mode
  ctx.globalCompositeOperation = "overlay";
  // Draw overlay shape
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  fillValue = "#1aff8c"
}


const setDrawableErasableProp = (drawable, value) => {
  canvas.get(drawable)?.set({ erasable: value });
  changeAction("erase");
};

const setBgImageErasableProp = (input) =>
  setDrawableErasableProp("backgroundImage", input.checked);

const setErasingRemovesErasedObjects = (input) =>
  (erasingRemovesErasedObjects = input.checked);

const downloadImage = () => {
  const ext = "png";
  const base64 = canvas.toDataURL({
    format: ext,
    enableRetinaScaling: true,
  });
  const link = document.createElement("a");
  link.href = base64;
  link.download = `eraser_example.${ext}`;
  link.click();
};

const downloadSelectedObject = () =>{
  const ext = "png";
  var selectedObject = canvas.getActiveObject();
  const base64 = selectedObject.toDataURL({
    format: ext,
    enableRetinaScaling: true,
  });
  const link = document.createElement("a");
  link.href = base64;
  link.download = `eraser_example.${ext}`;
  link.click();
}

const downloadSelectedObjectInSVG = () =>{
  var selectedObject = canvas.getActiveObject();
  const svg = selectedObject.toSVG();

  const a = document.createElement("a");
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const blobURL = URL.createObjectURL(blob);
  a.href = blobURL;
  a.download = "eraser_example.svg";
  a.click();
  URL.revokeObjectURL(blobURL);
}

const downloadSVG = () => {
  const svg = canvas.toSVG();
  const a = document.createElement("a");
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const blobURL = URL.createObjectURL(blob);
  a.href = blobURL;
  a.download = "eraser_example.svg";
  a.click();
  URL.revokeObjectURL(blobURL);
};

const toJSON = async () => {
  const json = canvas.toDatalessJSON(["clipPath", "eraser"]);
  const out = JSON.stringify(json, null, "\t");
  const blob = new Blob([out], { type: "text/plain" });
  const clipboardItemData = { [blob.type]: blob };
  try {
    navigator.clipboard &&
      (await navigator.clipboard.write([new ClipboardItem(clipboardItemData)]));
  } catch (error) {
    console.log(error);
  }
  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobURL;
  a.download = "eraser_example.json";
  a.click();
  URL.revokeObjectURL(blobURL);
};
init();
changeAction("draw");
