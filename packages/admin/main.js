import { createApp } from 'https://unpkg.com/petite-vue?module';

createApp({
  token: "894uztjmnsdfgsdfklgjh9384u5msdnfgsdfgopi134598",
  authorized: false,
  config: undefined,
  color: {
    r: 0,
    g: 0,
    b: 0,
  },
  actions: [],

  get authStatusText() {
    return this.authorized ? "Authorized" : "Unauthorized";
  },

  async authorize() {
    if (this.token === "") return;
    const response = await fetch("http://localhost:3000/admin?token=" + this.token);
    this.authorized = response.status === 200;
    this.config = await response.json();
  },

  onColorClick(index) {
    if (confirm("Are you sure you want to remove color "+this.getRgb(this.config.colors[index])) + "?") {
      this.config.colors.splice(index, 1);
    }
  },

  getRgb(color) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
  },

  addColor() {
    const {r, g, b} = this.color;
    const color = [r, g, b];

    if (!this.config.colors.find(x => JSON.stringify(x) === JSON.stringify(color))) {
      this.config.colors.push(color);
    } else {
      alert("Color already added!");
    }
  },

  toggleAction(action) {
    if (this.actions.includes(action)) {
      this.actions = this.actions.filter(x => x !== action);
    } else {
      this.actions.push(action);
    }
  },

  async save() {
    const body = {
      ...JSON.parse(JSON.stringify(this.config)), actions: JSON.parse(JSON.stringify(this.actions))
    }
    console.log("%cModified config:", "color: gray", body);

    if (confirm("Are you sure you want to submit these changes?")) {
      const response = await fetch("http://localhost:3000/admin?token=" + this.token,{
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });
      alert("Saving was " + (response.status === 200 ? "SUCCESSFUL" : "UNSUCCESSFUL"));
    }
  },
}).mount();