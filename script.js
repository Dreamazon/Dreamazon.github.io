// Set up your drawing options (colors, line width, etc.)
const drawingOptions = {
    color: '#000',         // Default color
    lineWidth: 3           // Default line width
};

// Initialize Fabric.js canvas
const canvas = new fabric.Canvas('drawingCanvas', {
    isDrawingMode: false // Start in drawing mode
});

// Function to update drawing options
function updateDrawingOptions() {
    const colorInput = document.getElementById('color');
    const lineWidthInput = document.getElementById('lineWidth');

    drawingOptions.color = colorInput.value;
    drawingOptions.lineWidth = parseInt(lineWidthInput.value);

    // Update the brush width immediately when the slider is adjusted
    canvas.freeDrawingBrush.color = drawingOptions.color;
    canvas.freeDrawingBrush.width = drawingOptions.lineWidth;
}

function stopDrawing() {
    canvas.isDrawingMode = false;
}

// Function to handle drawing on the canvas
function startDrawing(event) {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = drawingOptions.color;
    canvas.freeDrawingBrush.width = drawingOptions.lineWidth;
    canvas.freeDrawingBrush.opacity = 1; // You can adjust opacity as needed
}

// Event listeners for drawing tools
document.getElementById('startDrawing').addEventListener('click', startDrawing);
document.getElementById('stopDrawing').addEventListener('click', stopDrawing);
document.getElementById('color').addEventListener('input', updateDrawingOptions);
document.getElementById('lineWidth').addEventListener('input', updateDrawingOptions);

// Function to clear the canvas
function clearCanvas() {
    canvas.clear();
}

// Event listener for the "Clear Canvas" button
document.getElementById('clearCanvas').addEventListener('click', clearCanvas);

// Function to save the drawing as an image (PNG)
function saveDrawing() {
    const canvasDataUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = canvasDataUrl;
    downloadLink.download = 'drawing.png';
    downloadLink.click();
}

// Function to save the drawing as a JPEG image
function saveDrawingAsJPEG() {
    // Set canvas background to white
    canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));

    const jpegDataUrl = canvas.toDataURL({ format: 'jpeg', quality: 1.0 });
    const blob = dataURItoBlob(jpegDataUrl);

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'drawing.jpg'; // Set the file name to .jpg
    downloadLink.click();
}

// Event listener for the "Save Drawing as JPEG" button
document.getElementById('saveDrawingJPEG').addEventListener('click', saveDrawingAsJPEG);
document.getElementById('saveDrawing').addEventListener('click', saveDrawing);


// Helper function to convert data URI to Blob
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
}

canvas.on('object:added', function () {
    if (!isRedoing) {
        h = [];
    }
    isRedoing = false;
});

var isRedoing = false;
var h = [];

function undo() {
    if (canvas._objects.length > 0) {
        h.push(canvas._objects.pop());
        canvas.renderAll();
    }
}

function redo() {
    if (h.length > 0) {
        isRedoing = true;
        canvas.add(h.pop());
        canvas.renderAll();
    }
}

// Event listeners for Undo and Redo buttons
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('redo').addEventListener('click', redo);

// Function to create a rectangle
function createRectangle() {
    return new fabric.Rect({
        left: 0,
        top: 0,
        width: 0, // Initial width
        height: 0, // Initial height
        fill: 'transparent', // Transparent fill for now
        strokeWidth: drawingOptions.lineWidth,
        stroke: drawingOptions.color,
    });
}

// Function to create a circle
function createCircle() {
    return new fabric.Circle({
        left: 0,
        top: 0,
        radius: 0, // Initial radius
        fill: 'transparent', // Transparent fill for now
        strokeWidth: drawingOptions.lineWidth,
        stroke: drawingOptions.color,
    });
}

// Function to create a triangle
function createTriangle() {
    return new fabric.Triangle({
        left: 0,
        top: 0,
        width: 0, // Initial width
        height: 0, // Initial height
        fill: 'transparent', // Transparent fill for now
        strokeWidth: drawingOptions.lineWidth,
        stroke: drawingOptions.color,
    });
}

// Set up variables for shape drawing
let isDrawingShape = false;
let shapeStartX, shapeStartY;
let currentShape;

// Add event listeners for shape drawing buttons
document.getElementById('drawRectangle').addEventListener('click', function () {
    canvas.isDrawingMode = false;
    canvas.selection = false;
    isDrawingShape = true;
    currentShape = createRectangle();
});

document.getElementById('drawCircle').addEventListener('click', function () {
    canvas.isDrawingMode = false;
    canvas.selection = false;
    isDrawingShape = true;
    currentShape = createCircle();
});

document.getElementById('drawTriangle').addEventListener('click', function () {
    canvas.isDrawingMode = false;
    canvas.selection = false;
    isDrawingShape = true;
    currentShape = createTriangle();
});

// Event listener for mouse down to start drawing shape
canvas.on('mouse:down', function (event) {
    if (isDrawingShape) {
        const pointer = canvas.getPointer(event.e);
        shapeStartX = pointer.x;
        shapeStartY = pointer.y;
        currentShape.set({ left: shapeStartX, top: shapeStartY }).setCoords();
        canvas.add(currentShape);
        canvas.renderAll();
    }
});

// Event listener for mouse move to resize the shape
canvas.on('mouse:move', function (event) {
    if (isDrawingShape) {
        const pointer = canvas.getPointer(event.e);
        const width = pointer.x - shapeStartX;
        const height = pointer.y - shapeStartY;
        currentShape.set({ width: width, height: height }).setCoords();
        canvas.renderAll();
    }
});

// Event listener for mouse up to finish drawing shape
canvas.on('mouse:up', function () {
    if (isDrawingShape) {
        isDrawingShape = false;
    }
});
