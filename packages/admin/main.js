import { createApp } from 'https://unpkg.com/petite-vue?module';

createApp({
  token: "",
  authorized: false,

  get authStatusText() {
    return this.authorized ? "Authorized" : "Unauthorized";
  },

  authorize() {
    if (this.token === "") return;

    console.log("sending auth request to api...");
  }
}).mount()