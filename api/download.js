import archiver from "archiver";
import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const dirPath = path.resolve("./logos");

  if (!fs.existsSync(dirPath)) {
    return res
      .status(500)
      .json({ error: "A pasta logos não existe no servidor." });
  }

  const zipPath = "/tmp/logos.zip"; // Usamos /tmp na Vercel, pois é a única pasta onde podemos gravar arquivos.
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=logos.zip");

    res.sendFile(zipPath);
  });

  archive.on("error", (err) => res.status(500).json({ error: err.message }));

  archive.pipe(output);

  // Adicionar a pasta logos ao ZIP
  archive.directory(dirPath, "logos");

  archive.finalize();
}
