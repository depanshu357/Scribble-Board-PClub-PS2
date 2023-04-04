/*
 * FloodFill for fabric.js
 * @author Arjan Haverkamp (av01d)
 * @date October 2018
 */

var tempEnable = false;
var fillValue;

var FloodFill = {
  // Compare subsection of array1's values to array2's values, with an optional tolerance
  withinTolerance: function (array1, offset, array2, tolerance) {
    var length = array2.length,
      start = offset + length;
    tolerance = tolerance || 0;
    // Iterate (in reverse) the items being compared in each array, checking their values are
    // within tolerance of each other
    while (start-- && length--) {
      if (Math.abs(array1[start] - array2[length]) > tolerance) {
        return false;
      }
    }
    return true;
  },

  // The actual flood fill implementation
  fill: function (
    imageData,
    getPointOffsetFn,
    point,
    color,
    target,
    tolerance,
    width,
    height
  ) {
    var directions = [
        [1, 0],
        [0, 1],
        [0, -1],
        [-1, 0],
      ],
      coords = [],
      points = [point],
      seen = {},
      key,
      x,
      y,
      offset,
      i,
      x2,
      y2,
      minX = -1,
      maxX = -1,
      minY = -1,
      maxY = -1;

    // Keep going while we have points to walk
    while (!!(point = points.pop())) {
      x = point.x;
      y = point.y;
      offset = getPointOffsetFn(x, y);
      // Move to next point if this pixel isn't within tolerance of the color being filled
      if (!FloodFill.withinTolerance(imageData, offset, target, tolerance)) {
        continue;
      }
      if (x > maxX) {
        maxX = x;
      }
      if (y > maxY) {
        maxY = y;
      }
      if (x < minX || minX == -1) {
        minX = x;
      }
      if (y < minY || minY == -1) {
        minY = y;
      }

      // Update the pixel to the fill color and add neighbours onto stack to traverse
      // the fill area
      i = directions.length;
      while (i--) {
        // Use the same loop for setting RGBA as for checking the neighbouring pixels
        if (i < 4) {
          imageData[offset + i] = color[i];
          coords[offset + i] = color[i];
        }

        // Get the new coordinate by adjusting x and y based on current step
        x2 = x + directions[i][0];
        y2 = y + directions[i][1];
        key = x2 + "," + y2;

        // If new coordinate is out of bounds, or we've already added it, then skip to
        // trying the next neighbour without adding this one
        if (x2 < 0 || y2 < 0 || x2 >= width || y2 >= height || seen[key]) {
          continue;
        }

        // Push neighbour onto points array to be processed, and tag as seen
        points.push({ x: x2, y: y2 });
        seen[key] = true;
      }
    }
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      coords: coords,
    };
  },
}; // End FloodFill

var fcanvas; // Fabric fcanvas
var canvas;
var fillColor = "#f00";
var fillTolerance = 2;

function hexToRgb(hex, opacity) {
  opacity = Math.round(opacity * 255) || 255;
  hex = hex.replace("#", "");
  var rgb = [],
    re = new RegExp("(.{" + hex.length / 3 + "})", "g");
  hex.match(re).map(function (l) {
    rgb.push(parseInt(hex.length % 2 ? l + l : l, 16));
  });
  return rgb.concat(opacity);
}
var fillValue;
var drawingColorFillEl = document.getElementById("drawing-color-fill");
drawingLineWidthEl = document.getElementById("drawing-line-width");
drawingLineWidthEl.onchange = function () {
  fcanvas.freeDrawingBrush.width = parseInt(this.value, 10) || 30;
  this.previousSibling.innerHTML = this.value;
};
drawingColorEl = document.getElementById("drawing-color");
drawingColorEl.onchange = function () {
  var brush = fcanvas.freeDrawingBrush;
  brush.color = this.value;
  console.log("changed");
  // fillValue = this.value;
  //   if (brush.getPatternSrc) {
  //     brush.source = brush.getPatternSrc.call(brush);
  //   }
};
drawingColorFillEl.onchange = function () {
  fcanvas.freeDrawingBrush.fillColor = parseInt(this.value, 10) || 30;
  fillValue = this.value;
};
var isDown;
function onMouseDownRectangle(o) {
  // console.log(selectedObject);
  isDown = true;
  var pointer = fcanvas.getPointer(o.e);
  origX = pointer.x;
  origY = pointer.y;
  var pointer = fcanvas.getPointer(o.e);
  fcanvas.isDrawingMode = false;
  rect = new fabric.Rect({
    left: origX,
    top: origY,
    originX: "left",
    originY: "top",
    width: pointer.x - origX,
    height: pointer.y - origY,
    angle: 0,
    stroke: fcanvas.freeDrawingBrush.color,
    // fill: "rgba(255,0,0,0.5)",
    fill: fillValue,
    transparentCorners: false,
  });
  fcanvas.add(rect);
}
function onMouseMoveRectangle(o) {
  if (!isDown) return;
  // cosoe
  var pointer = fcanvas.getPointer(o.e);
  fcanvas.isDrawingMode = false;
  if (origX > pointer.x) {
    rect.set({ left: Math.abs(pointer.x) });
  }
  if (origY > pointer.y) {
    rect.set({ top: Math.abs(pointer.y) });
  }
  rect.set({ width: Math.abs(origX - pointer.x) });
  rect.set({ height: Math.abs(origY - pointer.y) });
  fcanvas.renderAll();
}
function onMouseUpRectangle(o) {
  isDown = false;
  isDrawingMode = true;
}
function onMouseDownCircle(o) {
  isDown = true;
  var pointer = fcanvas.getPointer(o.e);
  origX = pointer.x;
  origY = pointer.y;
  fcanvas.isDrawingMode = false;
  circle = new fabric.Circle({
    left: origX,
    top: origY,
    originX: "left",
    originY: "top",
    radius: pointer.x - origX,
    angle: 0,
    fill: fillValue,
    stroke: fcanvas.freeDrawingBrush.color,
    strokeWidth: 3,
  });
  fcanvas.add(circle);
}
function onMouseMoveCircle(o) {
  if (!isDown) return;
  var pointer = fcanvas.getPointer(o.e);
  fcanvas.isDrawingMode = false;
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
  fcanvas.renderAll();
}
function onMouseUpCircle(o) {
  isDown = false;
  isDrawingMode = true;
}
var tri;
function onMouseDownTriangle(o) {
  isDown = true;
  fcanvas.isDrawingMode = false;
  var pointer = fcanvas.getPointer(o.e);
  origX = pointer.x;
  origY = pointer.y;
  tri = new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    strokeWidth: 1,
    width: 2,
    height: 2,
    stroke: fcanvas.freeDrawingBrush.color,
    fill: fillValue,
    selectable: true,
    originX: "center",
  });
  fcanvas.add(tri);
}
function onMouseMoveTriangle(o) {
  if (!isDown) return;
  fcanvas.isDrawingMode = false;
  var pointer = fcanvas.getPointer(o.e);
  tri.set({
    width: Math.abs(origX - pointer.x),
    height: Math.abs(origY - pointer.y),
  });
  // console.log("isMoving")
  fcanvas.renderAll();
}
function onMouseUpTriangle(o) {
  isDown = false;
  isDrawingMode = true;
}

let erasingRemovesErasedObjects = false;
drawingLineWidthEl = document.getElementById("drawing-line-width");
drawingLineWidthEl.onchange = function () {
  fcanvas.freeDrawingBrush.width = parseInt(this.value, 10) || 30;
  this.previousSibling.innerHTML = this.value;
};

var clearEl = document.getElementById("clear-canvas");
clearEl.onclick = function () {
  fcanvas.clear();
};

var tempShadowColor;
drawingShadowWidth = document.getElementById("drawing-shadow-width");
drawingShadowOffset = document.getElementById("drawing-shadow-offset");
drawingShadowColorEl = document.getElementById("drawing-shadow-color");

drawingShadowColorEl.onchange = function () {
  fcanvas.isDrawingMode = true;
  // fcanvas.statefullCache = true;
  fcanvas.freeDrawingBrush.shadowColor = this.value;
  tempShadowColor = this.value;
  console.log(fcanvas.freeDrawingBrush.shadowColor, "shadowColor");
  if (fcanvas.freeDrawingBrush) {
    var brush = fcanvas.freeDrawingBrush;
    brush.color = drawingColorEl.value;
    if (brush.getPatternSrc) {
      brush.source = brush.getPatternSrc.call(brush);
    }
    brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    console.log(tempShadowColor);
    brush.shadow = new fabric.Shadow({
      blur: parseInt(drawingShadowWidth.value, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: document.getElementById("drawing-shadow-color").value,
    });
  }
};

drawingShadowWidth.onchange = function () {
  fcanvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 30;
  this.previousSibling.innerHTML = this.value;
  console.log(fcanvas.freeDrawingBrush.shadowBlur);
  if (fcanvas.freeDrawingBrush) {
    var brush = fcanvas.freeDrawingBrush;
    brush.color = drawingColorEl.value;
    if (brush.getPatternSrc) {
      brush.source = brush.getPatternSrc.call(brush);
    }
    brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    console.log(tempShadowColor);
    brush.shadow = new fabric.Shadow({
      blur: parseInt(drawingShadowWidth.value, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: document.getElementById("drawing-shadow-color").value,
    });
  }
  //   console.log(this)
};
drawingShadowOffset.onchange = function () {
  fcanvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 30;
  fcanvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 30;
  this.previousSibling.innerHTML = this.value;
  if (fcanvas.freeDrawingBrush) {
    var brush = fcanvas.freeDrawingBrush;
    brush.color = drawingColorEl.value;
    if (brush.getPatternSrc) {
      brush.source = brush.getPatternSrc.call(brush);
    }
    brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    console.log(tempShadowColor);
    brush.shadow = new fabric.Shadow({
      blur: parseInt(drawingShadowWidth.value, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: document.getElementById("drawing-shadow-color").value,
    });
  }
};

// var drawingOptionsEl = document.getElementById("drawing-mode-options")
document.getElementById("drawing-mode-selector").onchange = function () {
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
    const markerBrush = new fabric.MarkerBrush(fcanvas);
    markerBrush.color = "#000000"; // set color to black
    markerBrush.width = 20; // set stroke width to 20 pixels
    markerBrush.strokeLineCap = "round"; // set line cap to round

    fcanvas.isDrawingMode = true;
    fcanvas.freeDrawingBrush = markerBrush;
  } else {
    console.log(this.value);
    fcanvas.freeDrawingBrush = new fabric[this.value + "Brush"](fcanvas);

    if (fcanvas.freeDrawingBrush) {
      var brush = fcanvas.freeDrawingBrush;
      brush.color = drawingColorEl.value;
      if (brush.getPatternSrc) {
        brush.source = brush.getPatternSrc.call(brush);
      }
      brush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
      console.log(tempShadowColor);
      brush.shadow = new fabric.Shadow({
        blur: parseInt(drawingShadowWidth.value, 10) || 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: document.getElementById("drawing-shadow-color").value,
      });
    }
  }
};

// canvas.on('mouse:wheel',async function(opt) {
//   // var delta = opt.e.deltaY;
//   // var zoom = canvas.getZoom();
//   // zoom *= 0.999 ** delta;
//   // if (zoom > 20) zoom = 20;
//   // if (zoom < 0.01) zoom = 0.01;
//   var zoom = 20
//   fcanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
//   opt.e.preventDefault();
//   opt.e.stopPropagation();
// });

function floodFill(enable) {
  if (!enable) {
    fcanvas.off("mouse:down");
    fcanvas.selection = true;
    fcanvas.forEachObject(function (object) {
      object.selectable = true;
    });
    fcanvas.isDrawingMode = false;
    // fcanvas.isDrawingMode = true;
    // fcanvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    //   fcanvas.freeDrawingBrush.width = 35;
    //   fcanvas.freeDrawingBrush.color = "green";
    //   fcanvas.isDrawingMode = true;
    return;
  }
  fcanvas.isDrawingMode = false;
  fcanvas.discardActiveObject().renderAll(); // Hide object handles!
  fcanvas.selection = false;
  fcanvas.forEachObject(function (object) {
    object.selectable = false;
  });

  fcanvas.on({
    "mouse:down": function (e) {
      var mouse = fcanvas.getPointer(e.e);
      changeAction("select");
      var mouseX = Math.round(mouse.x);
      canvas = fcanvas.lowerCanvasEl;
      canvas.fillColor = "green";
      var mouseY = Math.round(mouse.y);
      var context = canvas.getContext("2d");
      var parsedColor = hexToRgb(fillColor);
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
        getPointOffset = function (x, y) {
          return 4 * (y * imageData.width + x);
        },
        targetOffset = getPointOffset(mouseX, mouseY),
        target = imageData.data.slice(targetOffset, targetOffset + 4);

      console.log(fcanvas, context);
      if (FloodFill.withinTolerance(target, 0, parsedColor, fillTolerance)) {
        // Trying to fill something which is (essentially) the fill color
        console.log("Ignore... same color");
        return;
      }

      context.fillStyle = "rgba(0, 122, 155, 1)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      // Set overlay blending mode
      context.globalCompositeOperation = "overlay";
      // Draw overlay shape
      //   ctx.fillRect(0, 0, canvas.width, canvas.height);
      fillValue = "#1aff8c";

      // Perform flood fill
      var data = FloodFill.fill(
        imageData.data,
        getPointOffset,
        { x: mouseX, y: mouseY },
        parsedColor,
        target,
        fillTolerance,
        imageData.width,
        imageData.height
      );

      if (0 == data.width || 0 == data.height) {
        return;
      }

      var tmpCanvas = document.createElement("canvas"),
        tmpCtx = tmpCanvas.getContext("2d");
      tmpCanvas.width = canvas.width;
      tmpCanvas.height = canvas.height;

      var palette = tmpCtx.getImageData(
        0,
        0,
        tmpCanvas.width,
        tmpCanvas.height
      ); // x, y, w, h
      palette.data.set(new Uint8ClampedArray(data.coords)); // Assuming values 0..255, RGBA
      tmpCtx.putImageData(palette, 0, 0); // Repost the data.
      var imgData = tmpCtx.getImageData(
        data.x,
        data.y,
        data.width,
        data.height
      ); // Get cropped image

      tmpCanvas.width = data.width;
      tmpCanvas.height = data.height;
      tmpCtx.putImageData(imgData, 0, 0);

      // Convert fcanvas back to image:
      var img = new Image();
      img.onload = function () {
        fcanvas.add(
          new fabric.Image(img, {
            left: data.x,
            top: data.y,
            selectable: false,
          })
        );
      };
      img.src = tmpCanvas.toDataURL("image/png");
      fcanvas.add(
        new fabric.Image(tmpCanvas, {
          left: data.x,
          top: data.y,
          selectable: false,
        })
      );
    },
  });
}

function changeAction(target) {
  console.log(target);
  if (tempEnable) return;
  var canvas = fcanvas.lowerCanvasEl;

  fcanvas.off("mouse:down"); // remove all event listeners
  fcanvas.off("mouse:move");
  fcanvas.off("mouse:up");
  console.log(canvas);
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
      fcanvas.isDrawingMode = false;
      break;
    case "fill":
      fcanvas.isDrawingMode = false;

      break;
    case "erase":
      fcanvas.freeDrawingBrush = new fabric.EraserBrush(fcanvas);
      fcanvas.freeDrawingBrush.width = 10;
      fcanvas.isDrawingMode = true;
      break;
    case "undo":
      fcanvas.freeDrawingBrush = new fabric.EraserBrush(fcanvas);
      fcanvas.freeDrawingBrush.width = 10;
      fcanvas.freeDrawingBrush.inverted = true;
      fcanvas.isDrawingMode = true;
      break;
    case "draw":
      fcanvas.freeDrawingBrush = new fabric.PencilBrush(fcanvas);
      fcanvas.freeDrawingBrush.width = 35;
      // canvas.freeDrawingBrush.color = "green";
      fcanvas.isDrawingMode = true;
      break;
    case "spray":
      fcanvas.freeDrawingBrush = new fabric.SprayBrush(fcanvas);
      fcanvas.freeDrawingBrush.width = 35;
      fcanvas.isDrawingMode = true;
      break;
    case "circle":
      fcanvas.on("mouse:down", onMouseDownCircle);
      fcanvas.on("mouse:move", onMouseMoveCircle);
      fcanvas.on("mouse:up", onMouseUpCircle);
      fcanvas.isDrawingMode = false;
      break;
    case "rectangle":
      // var rect, isDown, origX, origY;
      fcanvas.on("mouse:down", onMouseDownRectangle);
      fcanvas.on("mouse:move", onMouseMoveRectangle);
      fcanvas.on("mouse:up", onMouseUpRectangle);
      // function onObjectSelected(e) {
      //   console.log(e.target.get("type"));
      // }
      // canvas.on("object:selected", onObjectSelected);

      fcanvas.isDrawingMode = false;
      break;
    case "triangle":
      fcanvas.on("mouse:down", onMouseDownTriangle);
      fcanvas.on("mouse:move", onMouseMoveTriangle);
      fcanvas.on("mouse:up", onMouseUpTriangle);
      fcanvas.isDrawingMode = false;
      break;
    case "clip":
      fcanvas.on("mouse:down", onMouseDownClip);
      fcanvas.on("mouse:move", onMouseMoveClip);
      fcanvas.on("mouse:up", onMouseUpClip);
      fcanvas.isDrawingMode = false;
      break;
    default:
      break;
  }
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
  const base64 = fcanvas.toDataURL({
    format: ext,
    enableRetinaScaling: true,
  });
  const link = document.createElement("a");
  link.href = base64;
  link.download = `eraser_example.${ext}`;
  link.click();
};

const downloadSelectedObject = () => {
  const ext = "png";
  var selectedObject = fcanvas.getActiveObject();
  const base64 = selectedObject.toDataURL({
    format: ext,
    enableRetinaScaling: true,
  });
  const link = document.createElement("a");
  link.href = base64;
  link.download = `eraser_example.${ext}`;
  link.click();
};

const downloadSelectedObjectInSVG = () => {
  var selectedObject = fcanvas.getActiveObject();
  const svg = selectedObject.toSVG();

  const a = document.createElement("a");
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const blobURL = URL.createObjectURL(blob);
  a.href = blobURL;
  a.download = "eraser_example.svg";
  a.click();
  URL.revokeObjectURL(blobURL);
};

const downloadSVG = () => {
  const svg = fcanvas.toSVG();
  const a = document.createElement("a");
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const blobURL = URL.createObjectURL(blob);
  a.href = blobURL;
  a.download = "eraser_example.svg";
  a.click();
  URL.revokeObjectURL(blobURL);
};

const toJSON = async () => {
  const json = fcanvas.toDatalessJSON(["clipPath", "eraser"]);
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

$(function () {
  // Init UI:
  $("#removeObject").on("click", function () {
    var obj = fcanvas.getActiveObject();
    fcanvas.remove(obj);
  });

  $(document).keydown(function (e) {
    // Check if the pressed key is the delete key
    if (e.keyCode === 46 || e.keyCode === 8) {
      var obj = fcanvas.getActiveObject();
      fcanvas.remove(obj);
    }
  });

  $("div.color")
    .on("click", function () {
      $("div.color").removeClass("selected");
      $(this).addClass("selected");
      fillColor = $(this).data("color"); // Set in global var
    })
    .each(function () {
      $(this).css("backgroundColor", $(this).data("color"));
    });

  $("#tolerance").on("input", function () {
    fillTolerance = this.value; // Set in global var
  });

  $("input[name='mode']").on("click", function () {
    console.log("kuch hua");
    if (this.value == "floodFill") {
      console.log("hua");
    }
    tempEnable = this.value == "floodFill";
    floodFill(this.value == "floodFill");
  });

  // Init Fabric fcanvas:
  fcanvas = new fabric.Canvas("c", {
    backgroundColor: "#fff",
    enableRetinaScaling: false,
  });

  // Add some demo-shapes:
  fcanvas.add(
    new fabric.Circle({
      radius: 201*0.7,
      fill: false,
      left: 100,
      top: 100,
      stroke: "#000",
      strokeWidth: 2,
    })
  );
  fcanvas.add(
    new fabric.Triangle({
      width: 120,
      height: 160,
      left: 50,
      top: 50,
      stroke: "#000",
      fill: "#00f",
      strokeWidth: 2,
    })
  );
  fcanvas.add(
    new fabric.Rect({
      width: 120,
      height: 160,
      left: 150,
      top: 50,
      fill: "red",
      stroke: "#000",
      strokeWidth: 2,
    })
  );
  fcanvas.add(
    new fabric.Rect({
      width: 200,
      height: 120,
      left: 200,
      top: 120,
      fill: "green",
      stroke: "#000",
      strokeWidth: 2,
    })
  );
});
changeAction("select");
