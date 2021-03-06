import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { createApp } from 'https://unpkg.com/petite-vue?module';

createApp({
  timeout: undefined, // in seconds
  timeoutDuration: undefined,
  colors: [],
  mouse: {
    panButtonDown: false,
    offsetX: 0,
    offsetY: 0,
    scroll: 1,
    SPEED: 0.5,
    MAX: 0.8,
    MAX_ZOOM: 3,
    MIN_ZOOM: 0.1
  },


  mounted() {
    this.canvas = document.querySelector("#canvas");  // TODO - get ref to work instead of this
    this.canvas.addEventListener("contextmenu", e => e.preventDefault());
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;

    // Config socket and all callbacks
    this.socket = io("http://localhost:3000");
    this.socket.on("connect", () => {
      console.log("%cConnected", "color: green");
      document.querySelector(".container").classList.remove("loading");
    });
    this.socket.on("disconnect", () => {
      console.log("%cDisconnected", "color: red");
      document.querySelector(".container").classList.add("loading");
    });
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

          this.setPixelColor(x, y, { r, g, b });
        }
      }

      this.drawImage();
    });
    this.socket.on("update", (msg) => {
      console.log("%cUPDATE: ", "color: blue", msg);
      this.updateCanvas(msg);
    });
  },

  /**
   * @param {number} x original image x coordinate
   * @param {number} y original image y coordinate
   * @param {Array} color original image pixel color
   */
  setPixelColor(x, y, color) {
    const { r, g, b } = color;
    const index = (y * this.canvas.width * 4) + (x * 4);
    this.image.data[index + 0] = r;
    this.image.data[index + 1] = g;
    this.image.data[index + 2] = b;
    this.image.data[index + 3] = 255;
  },

  getPixelColor(x, y) {
    const index = (y * this.canvas.width * 4) + (x * 4);
    return [this.image.data[index + 0], this.image.data[index + 1], this.image.data[index + 2]];
  },

  send(data) {
    console.log("%cSending message...", "color: gray");
    this.socket.emit("place", data);

    if ((!this.timeout || this.timeout <= 0) && this.timeoutDuration) {
      this.setTimeout(this.timeoutDuration * 1000);
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

  drawImage() {
    requestAnimationFrame(() => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // this.context.scale(this.mouse.scroll, this.mouse.scroll);
      // createImageBitmap(this.image).then(image => this.context.drawImage(image, this.mouse.offsetX, this.mouse.offsetY))
      this.context.putImageData(this.image, this.mouse.offsetX, this.mouse.offsetY);
    });
  },

  updateCanvas(update) {
    if (!this.image) console.error("Have not received a 'initial' event yet.");

    const { x, y, color: [r, g, b] } = update;

    this.setPixelColor(x, y, { r, g, b });
    this.drawImage();
  },

  onCanvasClick(e) {
    if (this.timeout > 0) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / this.canvas.width) - this.mouse.offsetX);
    const y = Math.floor((e.clientY - rect.top) / (rect.height / this.canvas.height) - this.mouse.offsetY);
    if (x < 0 || x >= this.canvas.width) return;
    if (y < 0 || y >= this.canvas.height) return;

    const color = this.colors[this.selectedColorIndex];
    if (JSON.stringify(color) === JSON.stringify(this.getPixelColor(x, y))) return;   // Do not allow drawing over a pixel with the same color (wasting a draw)

    const data = { x, y, color };

    this.send(data);
  },

  onCanvasMouseMove(e) {
    if (this.mouse.panButtonDown) {
      const movementX = parseInt(e.movementX);
      const movementY = parseInt(e.movementY);

      this.mouse.offsetX += movementX * this.mouse.SPEED;
      this.mouse.offsetY += movementY * this.mouse.SPEED;

      // Limits
      this.mouse.offsetX = Math.min(this.mouse.offsetX, this.canvas.width * this.mouse.MAX);
      this.mouse.offsetX = Math.max(this.mouse.offsetX, -(this.canvas.width * this.mouse.MAX));
      this.mouse.offsetY = Math.min(this.mouse.offsetY, this.canvas.height * this.mouse.MAX);
      this.mouse.offsetY = Math.max(this.mouse.offsetY, -(this.canvas.height * this.mouse.MAX));

      this.drawImage();
    }
  },

  onCanvasMouseChange(e) {
    if (e.type === "mouseleave") {
      this.mouse.panButtonDown = false;
    }
    else if (e.type === "mousedown" && e.button !== 0) {
      this.mouse.panButtonDown = true;
    }
    else if (e.type === "mouseup" && e.button !== 0) {
      this.mouse.panButtonDown = false;
    }
  },

  onCanvasScroll(e) {
    const delta = parseInt(e.deltaY);

    this.mouse.scroll += delta / 1000;

    this.mouse.scroll = Math.min(this.mouse.scroll, this.mouse.MAX_ZOOM);
    this.mouse.scroll = Math.max(this.mouse.scroll, -this.mouse.MIN_ZOOM);

    this.drawImage();
  },



  /**
   * ====================== UI ======================
   */

  getRgb(color) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
  },

  onColorClick(index) {
    this.selectedColorIndex = index;
  },

  timeoutText() {
    return (this.timeout === undefined || this.timeout <= 0) ? "Ready to draw" : `${this.timeout}s`;
  }

}).mount()