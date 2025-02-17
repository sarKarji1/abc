import axios from 'axios';
import config from '../../config.cjs';

// Helper function to send messages with context
const sendCommandMessage = async (m, sock, messageContent) => {
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
          body: m.pushName || "User",
          thumbnailUrl: 'https://raw.githubusercontent.com/Sarkar-Bandaheali/BALOCH-MD_DATABASE/refs/heads/main/Pairing/1733805817658.webp',
          sourceUrl: 'https://github.com/Sarkar-Bandaheali/Sarkar-MD',
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    },
    { quoted: m }
  );
};

// Helper function to handle YouTube search
const handleYouTubeSearch = async (m, sock, query) => {
  try {
    const apiUrl = `https://api.davidcyriltech.my.id/youtube/search?query=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.results || response.data.results.length === 0) {
      await m.React('❌');
      await sendCommandMessage(m, sock, "❌ No results found on YouTube.");
      return;
    }

    const videoList = response.data.results.slice(0, 10); // Max 10 videos

    let messageText = `📢 *YouTube Search Results for:* _${query}_\n\n`;
    videoList.forEach((video, index) => {
      messageText += `*🔹 ${index + 1}. ${video.title}*\n`;
      messageText += `   🎬 *Uploaded:* ${video.published}\n`;
      messageText += `   ⏱ *Duration:* ${video.duration}\n`;
      messageText += `   👀 *Views:* ${video.views.toLocaleString()}\n`;
      messageText += `   🔗 *URL:* ${video.url}\n\n`;
    });

    messageText += `\n🚀 POWERED BY BANDAHEALI && SHABAN-MD`;

    await sendCommandMessage(m, sock, messageText);
    await m.React('✅');
  } catch (error) {
    console.error("❌ YouTube Search API Error:", error);
    await m.React('❌');
    await sendCommandMessage(m, sock, `⚠️ Error: ${error.message}`);
  }
};

// Helper function to handle sticker search
const handleStickerSearch = async (m, sock, query) => {
  try {
    const apiUrl = `https://api.davidcyriltech.my.id/search/sticker?text=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.result || !response.data.result.stickers || response.data.result.stickers.length === 0) {
      await m.React('❌');
      await sendCommandMessage(m, sock, "❌ No stickers found.");
      return;
    }

    const stickerList = response.data.result.stickers.slice(0, 10); // Max 10 stickers

    let messageText = `🖼 *Sticker Pack:* _${response.data.result.title}_\n`;
    messageText += `🔍 *Search Term:* _${query}_\n\n`;

    await sendCommandMessage(m, sock, messageText);

    for (let sticker of stickerList) {
      await sock.sendMessage(m.from, { image: { url: sticker }, caption: "✨ Sticker found!" }, { quoted: m });
    }

    await sendCommandMessage(m, sock, `🚀 POWERED BY BANDAHEALI && SHABAN-MD`);
    await m.React('✅');
  } catch (error) {
    console.error("❌ Sticker Search API Error:", error);
    await m.React('❌');
    await sendCommandMessage(m, sock, `⚠️ Error: ${error.message}`);
  }
};

// Helper function to handle SoundCloud search
const handleSoundCloudSearch = async (m, sock, query) => {
  try {
    const apiUrl = `https://api.davidcyriltech.my.id/search/soundcloud?text=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.result || response.data.result.length === 0) {
      await m.React('❌');
      await sendCommandMessage(m, sock, "❌ No results found on SoundCloud.");
      return;
    }

    const trackList = response.data.result.slice(0, 10); // Max 10 tracks

    let messageText = `🎧 *SoundCloud Search Results for:* _${query}_\n\n`;
    trackList.forEach((track, index) => {
      messageText += `*🔹 ${index + 1}. ${track.title}*\n`;
      messageText += `   🔗 *URL:* ${track.link}\n\n`;
    });

    messageText += `\n🚀 POWERED BY BANDAHEALI && SHABAN-MD`;

    await sendCommandMessage(m, sock, messageText);
    await m.React('✅');
  } catch (error) {
    console.error("❌ SoundCloud Search API Error:", error);
    await m.React('❌');
    await sendCommandMessage(m, sock, `⚠️ Error: ${error.message}`);
  }
};

// Helper function to handle Spotify search
const handleSpotifySearch = async (m, sock, query) => {
  try {
    const apiUrl = `https://api.davidcyriltech.my.id/search/spotify?text=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.result || response.data.result.length === 0) {
      await m.React('❌');
      await sendCommandMessage(m, sock, "❌ No results found on Spotify.");
      return;
    }

    const trackList = response.data.result.slice(0, 10); // Max 10 tracks

    let messageText = `🎵 *Spotify Search Results for:* _${query}_\n\n`;
    trackList.forEach((track, index) => {
      messageText += `*🔹 ${index + 1}. ${track.trackName}*\n`;
      messageText += `   🎤 *Artist:* ${track.artistName}\n`;
      messageText += `   💿 *Album:* ${track.albumName}\n`;
      messageText += `   ⏱ *Duration:* ${track.duration}\n`;
      messageText += `   🔗 *URL:* ${track.externalUrl}\n\n`;
    });

    messageText += `\n🚀 POWERED BY BANDAHEALI && SHABAN-MD`;

    await sendCommandMessage(m, sock, messageText);
    await m.React('✅');
  } catch (error) {
    console.error("❌ Spotify Search API Error:", error);
    await m.React('❌');
    await sendCommandMessage(m, sock, `⚠️ Error: ${error.message}`);
  }
};

// Main SearchCmd function
const searchCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmd === "yts2") {
    await m.React('⏳');

    const query = m.body.slice(cmd.length + config.PREFIX.length + 1).trim();
    if (!query) {
      await m.React('⚠️');
      await sendCommandMessage(m, sock, "⚠️ Please provide a search query.");
      return;
    }

    await handleYouTubeSearch(m, sock, query);
  }

  if (cmd === "stickersearch") {
    await m.React('⏳');

    const query = m.body.slice(cmd.length + config.PREFIX.length + 1).trim();
    if (!query) {
      await m.React('⚠️');
      await sendCommandMessage(m, sock, "⚠️ Please provide a search term for stickers.");
      return;
    }

    await handleStickerSearch(m, sock, query);
  }

  if (cmd === "soundcloud" || cmd === "sc") {
    await m.React('⏳');

    const query = m.body.slice(cmd.length + config.PREFIX.length + 1).trim();
    if (!query) {
      await m.React('⚠️');
      await sendCommandMessage(m, sock, "⚠️ Please provide a search term for SoundCloud.");
      return;
    }

    await handleSoundCloudSearch(m, sock, query);
  }

  if (cmd === "spotify" || cmd === "sp") {
    await m.React('⏳');

    const query = m.body.slice(cmd.length + config.PREFIX.length + 1).trim();
    if (!query) {
      await m.React('⚠️');
      await sendCommandMessage(m, sock, "⚠️ Please provide a search term for Spotify.");
      return;
    }

    await handleSpotifySearch(m, sock, query);
  }
};

export default searchCmd;