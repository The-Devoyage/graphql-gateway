import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

export const Router = express.Router({ strict: true });

const mediaServerUrl = process.env.MEDIA_SERVER_URL;
const mediaServingRoute = process.env.MEDIA_SERVING_ROUTE;

if (mediaServerUrl && mediaServingRoute) {
  Router.use(
    mediaServingRoute,
    createProxyMiddleware({
      target: mediaServerUrl,
      changeOrigin: false,
      pathRewrite: { [`^${mediaServingRoute}`]: "" },
    })
  );
} else {
  Router.use("*", (_, res) =>
    res.json({
      error: "Missing environment variables.",
      mediaServerUrl: mediaServerUrl ?? false,
      mediaServingRoute: mediaServingRoute ?? false,
    })
  );
}
