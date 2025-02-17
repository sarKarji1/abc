import axios from 'axios';
import config from '../../config.cjs';
import fetch from 'node-fetch';

const StalkCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const pushName = m.pushName || 'User';

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const args = m.body.slice(prefix.length).trim().split(' ').slice(1);
  const url = args[0];

  const sendCommandMessage = async (messageContent) => {
    await sock.sendMessage(
      m.from,
      {
        text: messageContent,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363315182578784@newsletter',
            newsletterName: "Sarkar-MD",
            serverMessageId: -1,
          },
          externalAdReply: {
            title: "✨ Sarkar-MD ✨",
            body: pushName,
            thumbnailUrl: 'https://raw.githubusercontent.com/Sarkar-Bandaheali/BALOCH-MD_DATABASE/refs/heads/main/Pairing/1733805817658.webp',
            sourceUrl: 'https://github.com/Sarkar-Bandaheali/Sarkar-MD',
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      },
      { quoted: m }
    );
  };

  const sendImageWithCaption = async (imageUrl, caption) => {
    await sock.sendMessage(
      m.from,
      {
        image: { url: imageUrl },
        caption,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363315182578784@newsletter',
            newsletterName: "Sarkar-MD",
            serverMessageId: -1,
          },
          externalAdReply: {
            title: "✨ Sarkar-MD ✨",
            body: pushName,
            thumbnailUrl: 'https://raw.githubusercontent.com/Sarkar-Bandaheali/BALOCH-MD_DATABASE/refs/heads/main/Pairing/1733805817658.webp', // Same thumbnail
            sourceUrl: 'https://github.com/Sarkar-Bandaheali/Sarkar-MD', // Same GitHub repo
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      },
      { quoted: m }
    );
  };

  // TIKTOK STALK COMMAND
  if (cmd === "tikstalk" || cmd === "tiktokstalk") {
    if (!args[0]) {
      await sendCommandMessage("❌ *Usage:* .stalktiktok <username>");
      return;
    }

    const username = args[0];
    const apiUrl = `https://api.siputzx.my.id/api/stalk/tiktok?username=${username}`;

    await m.React('⏳'); // Loading reaction

    try {
      const response = await fetch(apiUrl);
      const json = await response.json();

      if (!json.status) {
        await m.React('❌');
        await sendCommandMessage("⚠️ *User not found or API error!*");
        return;
      }

      const user = json.data.user;
      const stats = json.data.stats;

      const caption = `🌟 *TikTok Profile Stalked!* 🌟\n\n` +
                      `👤 *Username:* ${user.uniqueId}\n` +
                      `📛 *Name:* ${user.nickname}\n` +
                      `🌎 *Region:* ${user.region}\n` +
                      `✅ *Verified:* ${user.verified ? 'Yes' : 'No'}\n\n` +
                      `📊 *Stats:*\n` +
                      `👥 *Followers:* ${stats.followerCount}\n` +
                      `👤 *Following:* ${stats.followingCount}\n` +
                      `❤️ *Likes:* ${stats.heartCount}\n` +
                      `🎥 *Videos:* ${stats.videoCount}\n\n` +
                      `📝 *Bio:* ${user.signature || 'No Bio'}\n\n` +
                      `🔗 *Profile Link:* https://www.tiktok.com/@${user.uniqueId}`;

      await m.React('✅'); // Success reaction

      await sendImageWithCaption(user.avatarLarger, caption);

    } catch (error) {
      console.error(error);
      await m.React('❌');
      await sendCommandMessage("❌ *Error fetching TikTok profile!*");
    }
  }
  // NPM STALK COMMAND
if (cmd === "npmstalk" || cmd === "npm") {
  if (!args[0]) {
    await sendCommandMessage("❌ *Usage:* .npm <package_name>");
    return;
  }

  const packageName = args[0];
  const apiUrl = `https://api.siputzx.my.id/api/stalk/npm?packageName=${packageName}`;

  await m.React('⏳'); // Loading reaction

  try {
    const response = await fetch(apiUrl);
    const json = await response.json();

    if (!json.status) {
      await m.React('❌');
      await sendCommandMessage("⚠️ *Package not found or API error!*");
      return;
    }

    const data = json.data;

    const caption = `📦 *NPM Package Stalked!* 📦\n\n` +
                    `📌 *Package Name:* ${data.name}\n` +
                    `🚀 *Latest Version:* ${data.versionLatest}\n` +
                    `📅 *Last Published:* ${new Date(data.latestPublishTime).toLocaleString()}\n` +
                    `📊 *Weekly Downloads:* ${data.weeklyDownloads || 'N/A'}\n` +
                    `📝 *License:* ${data.license || 'N/A'}\n\n` +
                    `🔗 *NPM Link:* https://www.npmjs.com/package/${data.name}`;

    await m.React('✅'); // Success reaction

    await sendCommandMessage(caption);

  } catch (error) {
    console.error(error);
    await m.React('❌');
    await sendCommandMessage("❌ *Error fetching NPM package details!*");
  }
}
};

export default StalkCmd;