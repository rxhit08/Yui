// src/socket.js
import { io } from 'socket.io-client';

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const socket = io(`${baseUrl}`, {
  withCredentials: true,
});

export default socket;
