import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { HttpsProxyAgent } from "https-proxy-agent";
import https from "https";

// Handle local dev environment proxy scenarios
const agent = process.env.https_proxy || process.env.http_proxy 
  ? new HttpsProxyAgent(process.env.https_proxy || process.env.http_proxy || "")
  : new https.Agent({ rejectUnauthorized: false });

export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
  requestHandler: new NodeHttpHandler({
    httpsAgent: agent,
  }),
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
