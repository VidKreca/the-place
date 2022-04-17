import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { createApp } from 'https://unpkg.com/petite-vue?module';



createApp({
  // in seconds
  timeout: undefined, 
  timeoutDuration: undefined,


  mounted() {
    this.canvas = document.querySelector("#canvas");  // TODO - get ref to work instead of this
    this.context = this.canvas.getContext("2d");

    // Config socket and all callbacks
    this.socket = io("http://localhost:3000");
    this.socket.on("connect", () => console.log("%cConnected", "color: green"));
    this.socket.on("disconnect", () => console.log("%cDisconnected", "color: red"));
    this.socket.on("initial", (msg) => {
      console.log("%cReceived 'initial' message: ", "color: gray", msg);

      const { width, height, image: currentImage, timeoutDuration, colors } = msg;
      this.canvas.width = width;
      this.canvas.height = height;
      this.timeoutDuration = timeoutDuration;
      this.colors = colors;
      this.selectedColorIndex = 0;

      this.image = this.context.createImageData(width, height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let r, g, b;
          if (!currentImage[x][y]) {
            [r, g, b] = [255, 255, 255];  // Default pixel color is white
          } else {
            [r, g, b] = currentImage[x][y];
          }

          const index = (y * width * 4) + (x * 4);
          this.image.data[index + 0] = r;
          this.image.data[index + 1] = g;
          this.image.data[index + 2] = b;
          this.image.data[index + 3] = 255;
        }
      }

      this.draw();
    });
    this.socket.on("update", (msg) => {
      console.log("%cUPDATE: ", "color: blue", msg);
      this.updateCanvas(msg);
    });
  },

  send(data) {
    console.log("%cSending message...", "color: gray");
    this.socket.emit("place", data);

    if ((!this.timeout || this.timeout <= 0) && this.timeoutDuration) {
      this.setTimeout(this.timeoutDuration);
    }
  },

  setTimeout(length) {
    this.timeout = length;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.timeout -= 1;
      if (this.timeout <= 0) clearInterval(this.interval);
    }, 1000);
  },
  


  /**
   * ====================== CANVAS ======================
   */

  draw() {
    this.context.putImageData(this.image, 0, 0);
  },

  updateCanvas(update) {
    if (!this.image) console.error("Have not received a 'initial' event yet.");

    this.context.imageSmoothingEnabled = false;

    const { x, y, color: [ r, g, b ] } = update;

    const pixelIndex = (y * this.canvas.width * 4) + (x * 4);

    this.image.data[pixelIndex + 0] = r;
    this.image.data[pixelIndex + 1] = g;
    this.image.data[pixelIndex + 2] = b;
    this.image.data[pixelIndex + 3] = 255;

    this.draw();
  },

  onCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / this.canvas.width));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / this.canvas.height));

    const color = this.colors[this.selectedColorIndex];
    const data = { x, y, color};

    this.send(data);
  },

  /**
   * ====================== UI ======================
   */

  getRgb(color) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
  },

  onColorClick(index) {
    this.selectedColorIndex = index;
  }

}).mount()