import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { createApp } from 'https://unpkg.com/petite-vue?module';


const socket = io("http://localhost:3000");
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
let image;


/**
 * ===================== SOCKET.IO ===================== 
 */

socket.on("connect", () => {
  console.log("%cConnected", "color: green");
});
socket.on("disconnect", () => {
  console.log("%cDisconnected", "color: red");
});

socket.on("initial", (msg) => {
  console.log("%cReceived 'initial' message: ", "color: gray", msg);

  const { width, height, image: currentImage } = msg;
  canvas.width = width;
  canvas.height = height;

  image = context.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (currentImage[x][y] === null) {
        continue;
      }

      const index = (y * width * 4) + (x * 4);
      image.data[index + 0] = currentImage[x][y].r;
      image.data[index + 1] = currentImage[x][y].g;
      image.data[index + 2] = currentImage[x][y].b;
      image.data[index + 3] = 255;
    }
  }

  draw();
});

socket.on("update", (msg) => {
  console.log("%cUPDATE: ", "color: blue", msg);

  updateCanvas(msg);
});

function send(data) {
  console.log("%cSending message...", "color: gray");

  socket.emit("place", data);
}



/**
 * ===================== CANVAS ===================== 
 */
function draw() {
  // Draw current picture on canvas
  context.putImageData(image, 0, 0);
}
function updateCanvas(update) {
  if (!image) console.error("Have not received a 'initial' event yet.");

  context.imageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;

  const { x, y, color: { r, g, b } } = update;

  const pixelIndex = (y * canvas.width * 4) + (x * 4);

  image.data[pixelIndex + 0] = r;
  image.data[pixelIndex + 1] = g;
  image.data[pixelIndex + 2] = b;
  image.data[pixelIndex + 3] = 255;

  draw();
}



/**
 * ===================== CONTROL ===================== 
 */

function clickEventHandler(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / (rect.width / canvas.width));
  const y = Math.floor((event.clientY - rect.top) / (rect.height / canvas.height));

  const randomColorValue = () => Math.random() * 255;
  const randomColor = () => { return { r: randomColorValue(), g: randomColorValue(), b: randomColorValue() } };
  const data = { x, y, color: randomColor() };

  send(data);
}
canvas.addEventListener("mousedown", clickEventHandler);



/**
 * ===================== PETITE-VUE ===================== 
 */

createApp({
  timeout: undefined, // in seconds

  setTimeout(length) {
    this.timeout = length;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.timeout -= 1;
      if (this.timeout <= 0) clearInterval(this.interval);
    }, 1000);
  } 
}).mount()