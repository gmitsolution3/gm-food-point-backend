import "dotenv/config";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";

import { registerSocketHandler } from "./socket.handler";

let io: Server;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : process.env.FRONTEND_DEV_URL,
      credentials: true,
    },
  });

  registerSocketHandler(io);
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized.");
  }

  return io;
};
