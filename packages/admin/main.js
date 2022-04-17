import { createApp } from 'https://unpkg.com/petite-vue?module';

createApp({
  token: "",
  authorized: false,

  get authStatusText() {
    return this.authorized ? "Authorized" : "Unauthorized";
  },

  async authorize() {
    if (this.token === "") return;

    const response = await fetch("http://localhost:3000/admin?token=" + this.token, {method: "POST"});

    this.authorized = response.status === 200;
  }
}).mount();