import archiver from "archiver";
import path from "path";
import fs from "fs";

export default function handler(req, res) {
  const zipPath = "/tmp/logos.zip"; // Usamos /tmp na Vercel, pois é a única pasta onde podemos gravar arquivos.

  // Criar stream de escrita
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=logos.zip");

    // Enviar arquivo ZIP
    res.sendFile(zipPath);
  });

  archive.on("error", (err) => res.status(500).json({ error: err.message }));

  archive.pipe(output);

  // Adicionar a pasta logos ao ZIP
  archive.directory(path.resolve("./logos"), "logos");

  archive.finalize();
}
