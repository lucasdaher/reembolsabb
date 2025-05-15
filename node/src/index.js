const express = require("express");
const multer = require("multer");
const { minioClient, ensureBucket } = require("./minioClient");
const upload = multer();

const app = express();
const bucket = "reembolsos";

ensureBucket(bucket).catch(console.error);

app.post("/upload/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    let encontrado = false;
    const listResult = await minioClient.listObjects(bucket, "", true);
    await new Promise((resolve, reject) => {
      listResult.on("data", function (obj) {
        if (obj.name === fileId) {
          encontrado = true;
        }
      });
      listResult.on("end", resolve);
      listResult.on("error", reject);
    });

    if (!encontrado) {
      return res.status(404).json({ erro: "Objeto não encontrado no bucket." });
    }

    await minioClient.removeObject(bucket, fileId);
    res.json({ mensagem: "Objeto removido com sucesso", arquivo: fileId });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

app.get("/uploads", async (req, res) => {
  try {
    const data = [];
    const listResult = await minioClient.listObjects(bucket, "", true);
    listResult.on("data", function (obj) {
      data.push(obj);
    });
    listResult.on("end", function () {
      res.json({ data });
    });
  } catch (error) {
    listResult.on("error", function (err) {
      res.statusCode(500).json({
        error:
          "Um erro foi encontrado ao tentar realizar a listagem dos uploads.",
      });
    });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const objectName = `${Date.now()}_${file.originalname}`;

    await minioClient.putObject(bucket, objectName, file.buffer);

    return res.json({
      key: objectName,
      url: `${process.env.MINIO_ENDPOINT.replace(
        "9000",
        "9000"
      )}/${bucket}/${objectName}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro no upload" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Node API rodando na porta ${port}`));
