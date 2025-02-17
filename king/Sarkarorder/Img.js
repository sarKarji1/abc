import config from '../../config.cjs';
import axios from 'axios';

const PinterestCmd = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.slice(prefix.length + cmd.length).trim().split(' ');
  const query = args.join(" ");
  const isOwner = m.sender === ownerNumber;
  const isBot = m.sender === botNumber;
  const isAllowed = isOwner || isBot; // ✅ Sirf Owner & Bot use kar sakte hain

  if (cmd === 'img' || cmd === 'pinterest' || cmd === 'image' || cmd === 'searchpin') {
    if (!query) return m.reply("❌ *Please provide a search query.*");

    try {
      await m.reply(`🔎 *Searching images for:* ${query}...`);

      const url = `https://api.diioffc.web.id/api/search/pinterest?query=${encodeURIComponent(query)}`;
      const response = await axios.get(url);

      if (!response.data?.result?.length) return m.reply("⚠️ *No results found. Try another keyword.*");

      const results = response.data.result.sort(() => 0.5 - Math.random()).slice(0, 5);

      for (let i = 0; i < results.length; i++) {
        await Matrix.sendMessage(m.from, {
          image: { url: results[i].src },
          caption: `📸 *Search Result for:* ${query}\n\n> *POWERED BY BANDAHEALI*`
        }, { quoted: m });
      }
    } catch (error) {
      console.error("Error in Pinterest command:", error);
      m.reply("❌ *An error occurred while fetching images. Please try again later.*");
    }
  }
};

// POWERED BY BANDAHEALI
export default PinterestCmd;