import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export const Router = express.Router({ strict: true });

const mediaServerUrl = process.env.MEDIA_SERVER_URL;

if (mediaServerUrl) {
  Router.use(
    process.env.MEDIA_SERVING_ROUTE ?? "/public",
    createProxyMiddleware({
      target: process.env.MEDIA_SERVER_URL,
      changeOrigin: false,
    })
  );
}
