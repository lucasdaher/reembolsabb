const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT.split(":")[0],
  port: parseInt(process.env.MINIO_ENDPOINT.split(":")[1], 10),
  useSSL: false,
  accessKey: process.env.MINIO_USER,
  secretKey: process.env.MINIO_PASS,
});

// Garante que o bucket exista
async function ensureBucket(bucketName) {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName, "us-east-1");
  }
}

module.exports = { minioClient, ensureBucket };
