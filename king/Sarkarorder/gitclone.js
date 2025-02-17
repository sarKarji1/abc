import config from '../../config.cjs';
import fetch from 'node-fetch';

const GitCloneCmd = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args = m.body.slice(prefix.length + cmd.length).trim().split(' ');
  const isOwner = m.sender === ownerNumber;
  const isBot = m.sender === botNumber;
  const isAllowed = isOwner || isBot; // ✅ Sirf Owner & Bot use kar sakte hain

  if (cmd === 'gitclone' || cmd === 'git') {
    if (!args[0]) return m.reply("❌ *Where is the GitHub link?*\n\n✅ *Example:*\n.gitclone https://github.com/BANDAHEALI/SARKAR-MD");
    if (!/^https:\/\/github\.com\/.+/i.test(args[0])) return m.reply("⚠️ *Invalid GitHub link!*");

    try {
      const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
      const match = args[0].match(regex);
      if (!match) throw new Error("❌ *Invalid GitHub URL!*");

      const [_, repoOwner, repoName] = match;
      const zipUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/zipball`;
      const response = await fetch(zipUrl, { method: "HEAD" });

      if (!response.ok) throw new Error("❌ *Repository not found!*");

      const filename = `${repoName}.zip`;

      await m.reply(`📥 *DOWNLOADING REPOSITORY...*\n\n📌 *Repository:* ${repoOwner}/${repoName}\n📂 *Filename:* ${filename}\n\n> *POWERED BY BANDAHEALI*`);

      await Matrix.sendMessage(m.from, {
        document: { url: zipUrl },
        fileName: filename,
        mimetype: 'application/zip'
      }, { quoted: m });

    } catch (e) {
      console.error("Error in gitclone command:", e);
      m.reply("❌ *Failed to download the repository. Please try again later!*");
    }
  }
};

// POWERED BY BANDAHEALI
export default GitCloneCmd;