import config from "../../config.cjs";
import axios from "axios";

const aiImg = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : "";
  const query = m.body.slice(prefix.length + cmd.length).trim(); // Extract query

  if (cmd === "text2img") {
    if (!query) {
      return gss.sendMessage(m.from, { 
        text: "❌ براہ کرم امیج بنانے کے لیے ایک پرامپٹ فراہم کریں۔" 
      }, { quoted: m });
    }

    await m.React?.("⏳"); // Ensure React function exists

    try {
      const imageUrl = `https://manul-ofc-tech-api-1e5585f5ebef.herokuapp.com/fluxai?prompt=${encodeURIComponent(query)}`;

      const response = await axios.get(imageUrl);
      if (!response || response.status !== 200) {
        throw new Error("Invalid API response");
      }

      await gss.sendMessage(m.from, {
        image: { url: imageUrl },
        caption: `🎨 *Generated Image*\n\n📌 *Prompt:* ${query}\n🚀 *_Sarkar-MD Powered by BANDAHEALI_*`,
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
            body: "Ai Image generated",
            thumbnailUrl: "https://raw.githubusercontent.com/Sarkar-Bandaheali/BALOCH-MD_DATABASE/refs/heads/main/Pairing/1733805817658.webp",
            sourceUrl: "https://github.com/Sarkar-Bandaheali/Sarkar-MD",
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      }, { quoted: m });

      await m.React?.("✅");
    } catch (error) {
      console.error("AI Image Error:", error.message);
      await m.React?.("❌");
      gss.sendMessage(m.from, { 
        text: "⚠️ معاف کیجیے، تصویر بنانے میں مسئلہ ہوا۔ دوبارہ کوشش کریں۔" 
      }, { quoted: m });
    }
  }
};

export default aiImg;