import axios from "axios";
import config from "../../config.cjs";
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import os from "os";
import path from "path";

const IMGUR_CLIENT_ID = "51c547f88a81855"; // Your Imgur Client ID

const toolsCommand = async (m, sock) => {
  const prefix = config.PREFIX;
  const pushName = m.pushName || "User";

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : "";
  const args = m.body.slice(prefix.length).trim().split(" ").slice(1);
  const query = args.join(" "); // Fixed query for TTS

  const sendCommandMessage = async (messageContent) => {
    await sock.sendMessage(
      m.from,
      {
        text: messageContent,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363315182578784@newsletter",
            newsletterName: "Sarkar-MD",
            serverMessageId: -1,
          },
          externalAdReply: {
            title: "✨ Sarkar-MD ✨",
            body: pushName,
            thumbnailUrl:
              "https://raw.githubusercontent.com/Sarkar-Bandaheali/BALOCH-MD_DATABASE/refs/heads/main/Pairing/1733805817658.webp",
            sourceUrl: "https://github.com/Sarkar-Bandaheali/Sarkar-MD",
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      },
      { quoted: m }
    );
  };

  // ✅ Screenshot Commands ✅
  if (cmd === "ss" || cmd === "fullss" || cmd === "webss") {
    if (!args[0]) {
      await sendCommandMessage(`❌ *Usage:* .${cmd} <website_url>`);
      return;
    }

    const deviceType =
      cmd === "ss" ? "phone" : cmd === "fullss" ? "tablet" : "web";
    const apiUrl = `https://bk9.fun/tools/screenshot?url=${encodeURIComponent(
      args[0]
    )}&device=${deviceType}`;
    const caption = `📸 *${cmd.toUpperCase()} Screenshot*`;

    await m.React("⏳");
    try {
      await sock.sendMessage(
        m.from,
        { image: { url: apiUrl }, caption },
        { quoted: m }
      );
      await m.React("✅");
    } catch (error) {
      await m.React("❌");
      await sendCommandMessage(`❌ *Failed to capture screenshot!*`);
    }
  }

  // ✅ Fetch API Command ✅
  if (cmd === "fetch" || cmd === "get") {
    if (!args[0]) {
      await sendCommandMessage("❌ *Usage:* .fetch <API URL>");
      return;
    }

    await m.React("⏳");
    try {
      const response = await fetch(args[0]);
      const data = await response.json();
      const formattedData = JSON.stringify(data, null, 2).slice(0, 4000); // Limit message size
      await m.React("✅");
      await sendCommandMessage(`📌 *API Response:*  \n\`\`\`${formattedData}\`\`\``);
    } catch (error) {
      await m.React("❌");
      await sendCommandMessage("❌ *Invalid API or Network Error!*");
    }
  }

  // ✅ TTS (Text-to-Speech) Command ✅
  if (cmd === "tts") {
    await m.React("⏳");
    try {
      if (!query) {
        return await sendCommandMessage("براہ کرم، کوئی متن فراہم کریں! 📝");
      }

      const apiUrl = `https://bk9.fun/tools/tts?q=${encodeURIComponent(query)}&lang=`;

      await sock.sendMessage(
        m.from,
        {
          audio: { url: apiUrl },
          mimetype: "audio/mp4",
          ptt: true,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363315182578784@newsletter",
              newsletterName: "Sarkar-MD",
              serverMessageId: -1,
            },
            externalAdReply: {
              title: "✨ Sarkar-MD ✨",
              body: "Listen to TTS Audio",
              thumbnailUrl:
                "https://raw.githubusercontent.com/Sarkar-Bandaheali/BALOCH-MD_DATABASE/refs/heads/main/Pairing/1733805817658.webp",
              sourceUrl: "https://github.com/Sarkar-Bandaheali/Sarkar-MD",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );

      await m.React("✅");
    } catch (error) {
      await m.React("❌");
      await sendCommandMessage("⚠️ معاف کیجیے، TTS آڈیو حاصل کرنے میں مسئلہ ہوا۔ دوبارہ کوشش کریں۔");
    }
  }

  // ✅ URL Shortener ✅
  if (cmd === "shorten") {
    await m.React("⏳");

    if (!args[0]) {
      return await sendCommandMessage("❌ *Usage:* .shorten <URL>");
    }

    const userUrl = args[0]; // User-provided URL
    const apiUrl = `https://bk9.fun/tools/shorten?url=${encodeURIComponent(
      userUrl
    )}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.status || !data.BK9 || !data.BK9.url) {
        throw new Error("Invalid response from API");
      }

      const originalUrl = data.BK9.origin;
      const shortUrl = data.BK9.url;

      const messageText = `🔗 *URL Shortened Successfully!*\n\n📌 *Original:* ${originalUrl}\n🔖 *Shortened:* ${shortUrl}\n\n🚀 *_Sarkar-MD Powered by BANDAHEALI_*`;

      await sendCommandMessage(messageText);

      await m.React("✅");
    } catch (error) {
      console.error(error);
      await m.React("❌");
      await sendCommandMessage("⚠️ *Failed to shorten the URL. Please try again!*");
    }
  }

  // ✅ Upload to Imgur (tourl) ✅
  if (cmd === "tourl" || cmd === "url") {
    try {
      if (!m.quoted || !m.quoted.message) {
        throw "*🌻 Please reply to an image or video!*";
      }

      const message = m.quoted.message;
      let mimeType = "";
      let mediaMessage;

      if (message.imageMessage) {
        mimeType = "image/jpeg";
        mediaMessage = message.imageMessage;
      } else if (message.videoMessage) {
        mimeType = "video/mp4";
        mediaMessage = message.videoMessage;
      } else if (message.stickerMessage) {
        mimeType = "image/webp";
        mediaMessage = message.stickerMessage;
      }

      if (!mediaMessage) {
        throw "*🌻 Please reply to a valid image or video!*";
      }

      const fileBuffer = await m.quoted.download();
      if (!fileBuffer || fileBuffer.length === 0) {
        throw "*❌ Media download failed!*";
      }

      const fileExt = mimeType.includes("video") ? "mp4" : "jpg";
      const tempFilePath = path.join(os.tmpdir(), `sarkar_temp_media.${fileExt}`);
      fs.writeFileSync(tempFilePath, fileBuffer);

      const formData = new FormData();
      formData.append("image", fs.createReadStream(tempFilePath));

      const apiUrl = `https://api.imgur.com/3/upload`;
      const response = await axios.post(apiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
      });

      fs.unlinkSync(tempFilePath);

      if (!response.data || !response.data.data || !response.data.data.link) {
        throw "❌ Error uploading the media.";
      }

      const mediaUrl = response.data.data.link;
      await sendCommandMessage(`*📸 Sarkar-MD MEDIA URL*\n🔗 *URL:* ${mediaUrl}`);

    } catch (error) {
      await sendCommandMessage(`❌ Error: ${error.message || error}`);
    }
  }
};

export default toolsCommand;