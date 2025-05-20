// src/services/huggingface.service.js
import axios from "axios";
import { HF_API_KEY } from "../config/env.config.js";

const hfAPI = axios.create({
  baseURL: "https://api-inference.huggingface.co/models",
  headers: {
    Authorization: `Bearer ${HF_API_KEY}`
  }
});

export default hfAPI;
