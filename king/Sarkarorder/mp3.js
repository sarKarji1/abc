import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import config from "../../config.cjs";
import { downloadContentFromMessage } from "@whiskeysockets/baileys"; // ✅ Baileys Media Fix

const videoToMp3 = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : "";

  if (cmd === "mp3") {
    const quotedMsg = m.quoted ? m.quoted : null;

    // Log the quoted message for debugging
    console.log("Quoted Message:", JSON.stringify(quotedMsg, null, 2));

    if (!quotedMsg || quotedMsg.mtype !== "videoMessage" || !quotedMsg?.mediaKey || !quotedMsg?.url) {
      return gss.sendMessage(m.from, { text: "❌ معذرت، یہ ویڈیو MP3 میں تبدیل نہیں ہو سکتی۔" }, { quoted: m });
    }

    await m.React?.("⏳"); // Loading reaction

    try {
      // Ensure temp directory exists
      if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");

      const inputPath = "./temp/input.mp4";
      const outputPath = "./temp/output.mp3";

      // ✅ FIXED: Correct Baileys Media Download
      const stream = await downloadContentFromMessage(quotedMsg, "video");
      const buffer = [];
      for await (const chunk of stream) {
        buffer.push(chunk);
      }
      fs.writeFileSync(inputPath, Buffer.concat(buffer));

      // Convert video to MP3 using fluent-ffmpeg
      ffmpeg(inputPath)
        .output(outputPath)
        .noVideo() // Remove video stream
        .audioBitrate("128k") // Set audio bitrate
        .on("end", async () => {
          // Send MP3 file
          await gss.sendMessage(
            m.from,
            {
              audio: fs.readFileSync(outputPath),
              mimetype: "audio/mp4",
              ptt: false, // false = normal audio, true = voice note
            },
            { quoted: m }
          );

          // Delete temp files
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);

          await m.React?.("✅"); // Success reaction
        })
        .on("error", async (error) => {
          console.error("FFmpeg Error:", error.message);
          await m.React?.("❌");
          return gss.sendMessage(
            m.from,
            { text: "⚠️ معاف کیجیے، MP3 میں تبدیل کرنے میں مسئلہ ہوا۔" },
            { quoted: m }
          );
        })
        .run();
    } catch (error) {
      console.error("Video to MP3 Error:", error);
      await m.React?.("❌");
      gss.sendMessage(m.from, { text: `⚠️ معاف کیجیے، کچھ غلط ہو گیا۔\n\n🔍 Error: ${error.message}` }, { quoted: m });
    }
  }
};

export default videoToMp3;