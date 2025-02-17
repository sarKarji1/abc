import moment from 'moment-timezone';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import axios from 'axios';
import config from '../../config.cjs';
import yts from 'yt-search';
import fs from 'fs';
import path from 'path';

const DownloadCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const pushName = m.pushName || 'User';

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const url = m.body.slice(prefix.length + cmd.length + 1).trim(); // Extract TikTok link

  // Common function to send a command message
  const sendCommandMessage = async (messageContent, isVideo = false, videoUrl = '') => {
    const messagePayload = isVideo
      ? {
          video: { url: videoUrl },
          caption: messageContent,
        }
      : {
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
              renderLargerThumbnail: true,
            },
          },
        };

    await sock.sendMessage(m.from, messagePayload, { quoted: m });
  };
  // Command for TikTok downloader
if (cmd === "tiktok" || cmd === "tt") {
  if (!url.includes("tiktok.com")) {
    await sendCommandMessage("⚠️ Please provide a valid TikTok link!");
    return;
  }

  try {
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Fetch TikTok video data
    const response = await axios.get(`https://api.siputzx.my.id/api/tiktok?url=${url}`);
    const result = response.data?.data;

    if (result && result.urls && result.urls.length > 0) {
      const videoUrl = result.urls[0];
      const caption = `🔰 *TikTok Video* 🔰\n\n🔗 *Original URL:* ${result.original_url}\n📹 *Video Type:* ${result.type}\n🚀 POWERED BY BANDAHEALI`;

      // Send video with caption
      await sendCommandMessage(caption, true, videoUrl);

      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
    } else {
      await sendCommandMessage("⚠️ Failed to download the TikTok video. Please try again later!");
    }
  } catch (error) {
    console.error(error);
    await sendCommandMessage("⚠️ An error occurred while fetching the TikTok video. Please try again later!");
  }
}


  // Command for Facebook downloader
if (cmd === "facebook" || cmd === "fb") {
  if (!url.includes('facebook.com')) {
    await sendCommandMessage("⚠️ Please provide a valid Facebook link!");
    return;
  }

  try {
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Fetch Facebook video data
    const response = await axios.get(`https://api.davidcyriltech.my.id/facebook?url=${url}`);
    const result = response.data?.video;

    if (result && result.downloads && result.downloads.length > 0) {
      const videoUrl = result.downloads[0].downloadUrl; // Default to SD quality
      const caption = `🔰 *Facebook Video* 🔰\n\n🎥 *Title:* ${result.title}\n📥 *Quality:* ${result.downloads[0].quality}\n🚀 POWERED BY BANDAHEALI`;

      // Send video with caption
      await sendCommandMessage(caption, true, videoUrl);

      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
    } else {
      await sendCommandMessage("⚠️ Failed to download the Facebook video. Please try again later!");
    }
  } catch (error) {
    console.error(error);
    await sendCommandMessage("⚠️ An error occurred while fetching the Facebook video. Please try again later!");
  }
}
// Facebook command 2
// Command for Facebook downloader
if (cmd === "facebook2" || cmd === "fb2") {
  if (!url.includes('facebook.com')) {
    await sendCommandMessage("⚠️ Please provide a valid Facebook link!");
    return;
  }

  try {
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Fetch Facebook video data
    const response = await axios.get(`https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${url}`);
    const result = response.data;

    if (result && result.status && result.data.length > 0) {
      const videoData = result.data[0]; // Default to the first video option
      const videoUrl = videoData.url;
      const caption = `🔰 *Facebook Video* 🔰\n\n🎥 *Resolution:* ${videoData.resolution}\n🚀 POWERED BY BANDAHEALI`;

      // Send video with caption
      await sendCommandMessage(caption, true, videoUrl);

      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
    } else {
      await sendCommandMessage("⚠️ Failed to download the Facebook video. Please try again later!");
    }
  } catch (error) {
    console.error(error);
    await sendCommandMessage("⚠️ An error occurred while fetching the Facebook video. Please try again later!");
  }
}
// Instagram video doenlaoder 
if (cmd === "instagram" || cmd === "ig") {
  if (!url.includes('instagram.com')) {
    await sendCommandMessage("⚠️ Please provide a valid Instagram link!");
    return;
  }

  try {
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Fetch Instagram video data
    const response = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${url}`);
    const result = response.data?.data[0];

    if (result && result.url) {
      const videoUrl = result.url; // Video download URL
      const caption = `🔰 *Instagram Video* 🔰\n\n🚀 POWERED BY BANDAHEALI`;

      // Send video with caption
      const sentMessage = await sendCommandMessage(caption, true, videoUrl);

      // React with a success emoji
      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

      // Delete the video link after 10 seconds (optional delay)
      setTimeout(async () => {
        try {
          await sock.sendMessage(m.from, { delete: sentMessage.key });
          console.log("Video link deleted successfully.");
        } catch (deleteError) {
          console.error("Failed to delete the video link:", deleteError);
        }
      }, 10000); // 10 seconds delay
    } else {
      await sendCommandMessage("⚠️ Failed to download the Instagram video. Please try again later!");
    }
  } catch (error) {
    console.error(error);
    await sendCommandMessage("⚠️ An error occurred while fetching the Instagram video. Please try again later!");
  }
}
//instagram2for vifeo handling
if (cmd === "instagram2" || cmd === "insta2") {
  if (!url.includes('instagram.com')) {
    await sendCommandMessage("⚠️ Please provide a valid Instagram link!");
    return;
  }

  try {
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Fetch Instagram video data
    const response = await axios.get(`https://bk9.fun/download/instagram?url=${url}`);
    const result = response.data?.BK9;

    if (result && result.length > 0) {
      // Filter for video URLs
      const videoUrls = result.filter(item => item.type === "video").map(item => item.url);

      if (videoUrls.length > 0) {
        const videoUrl = videoUrls[0]; // Use the first video URL
        const caption = `🔰 *Instagram Video* 🔰\n\n🚀 POWERED BY BANDAHEALI`;

        // Send video with caption
        const sentMessage = await sendCommandMessage(caption, true, videoUrl);

        // React with a success emoji
        await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

        // Delete the video link after 10 seconds (optional delay)
        setTimeout(async () => {
          try {
            await sock.sendMessage(m.from, { delete: sentMessage.key });
            console.log("Video link deleted successfully.");
          } catch (deleteError) {
            console.error("Failed to delete the video link:", deleteError);
          }
        }, 10000); // 10 seconds delay
      } else {
        await sendCommandMessage("⚠️ No video found in the provided Instagram link!");
      }
    } else {
      await sendCommandMessage("⚠️ Failed to download the Instagram video. Please try again later!");
    }
  } catch (error) {
    console.error(error);
    await sendCommandMessage("⚠️ An error occurred while fetching the Instagram video. Please try again later!");
  }
}
// Command for Twitter downloader
if (cmd === "twit" || cmd === "twitter") {
  if (!url.includes('twitter.com')) {
    await sendCommandMessage("⚠️ Please provide a valid Twitter link!");
    return;
  }

  try {
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Fetch Twitter video data
    const response = await axios.get(`https://bk9.fun/download/twitter?url=${url}`);
    const result = response.data;

    if (result && result.status) {
      const videoUrl = result.BK9.HD;
      const username = result.BK9.username;
      const captionText = result.BK9.caption;
      const thumbnail = result.BK9.thumbnail;
      const caption = `🔰 *Twitter Video* 🔰\n\n👤 *Username:* ${username}\n📝 *Caption:* ${captionText}\n🚀 POWERED BY BANDAHEALI`;

      // Send video with caption
      await sendCommandMessage(caption, true, videoUrl);

      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
    } else {
      await sendCommandMessage("⚠️ Failed to download the Twitter video. Please try again later!");
    }
  } catch (error) {
    console.error(error);
    await sendCommandMessage("⚠️ An error occurred while fetching the Twitter video. Please try again later!");
  }
}

// yta || song command
  if (cmd === "play" || cmd === "song") {
  if (!url) {
    await sendCommandMessage("⚠️ Please provide a song name or a YouTube link!");
    return;
  }

  try {
    // React with loading icon while processing
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Handle search if a direct YouTube link is not provided
    let videoUrl = url;
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      const searchResults = await yts(url);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        await sendCommandMessage(`❌ No results found for "${url}".`);
        return;
      }
      videoUrl = searchResults.videos[0].url;
    }

    // Call the API to download the audio
    const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`;
    const response = await axios.get(apiUrl);

    if (!response.data.status || !response.data.result || !response.data.result.download_url) {
      await sendCommandMessage("⚠️ Failed to download audio. Please try again later!");
      return;
    }

    const { title, download_url } = response.data.result;

    // Send the audio file
    await sock.sendMessage(m.from, {
      audio: { url: download_url },
      mimetype: 'audio/mp4',
      ptt: false,
    }, { quoted: m });

    // Send success message with caption
    const caption = `🎵 *${title}* has been successfully downloaded!\n🚀 POWERED BY BANDAHEALI`;
    await sendCommandMessage(caption);

    // React with success icon
    await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error(error);

    // Clear loading reaction and provide error feedback
    await sock.sendMessage(m.from, { react: { text: "❌", key: m.key } });
    await sendCommandMessage("❌ An error occurred while processing your request. Please try again later!");
  }
}

if (cmd === "video" || cmd === "ytv") {
  if (!url) {
    await sendCommandMessage("⚠️ Please provide a song name or a YouTube link!");
    return;
  }

  try {
    // React with loading icon while processing
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Handle search if a direct YouTube link is not provided
    let videoUrl = url;
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      const searchResults = await yts(url);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        await sendCommandMessage(`❌ No results found for "${url}".`);
        return;
      }
      videoUrl = searchResults.videos[0].url;
    }

    // Call the API to download the video
    const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;
    const response = await axios.get(apiUrl);

    if (!response.data.status || !response.data.result || !response.data.result.download_url) {
      await sendCommandMessage("⚠️ Failed to download video. Please try again later!");
      return;
    }

    const { title, download_url } = response.data.result;

    // Send the video file
    await sock.sendMessage(m.from, {
      video: { url: download_url },
      caption: `🎥 *${title}* has been successfully downloaded!\n🚀 POWERED BY BANDAHEALI`,
    }, { quoted: m });

    // React with success icon
    await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error(error);

    // Clear loading reaction and provide error feedback
    await sock.sendMessage(m.from, { react: { text: "❌", key: m.key } });
    await sendCommandMessage("❌ An error occurred while processing your request. Please try again later!");
  }
}
// video2 and ytv2 for beetter handling
//Sarkar-MD

if (cmd === "video2" || cmd === "ytv2") {
  if (!url) {
    await sendCommandMessage("⚠️ Please provide a song name or a YouTube link!");
    return;
  }

  try {
    // React with loading icon while processing
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Search YouTube if the input is a query, not a YouTube link
    let videoUrl = url;
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      const searchResults = await yts(url);
      if (!searchResults.videos || searchResults.videos.length === 0) {
        await sendCommandMessage(`❌ No results found for "${url}".`);
        return;
      }
      videoUrl = searchResults.videos[0].url;
    }

    // Call the new API with the resolved video URL
    const apiUrl = `https://bk9.fun/download/youtube2?url=${encodeURIComponent(videoUrl)}`;
    const response = await axios.get(apiUrl);

    if (!response.data.status || !response.data.BK9 || response.data.BK9.length === 0) {
      await sendCommandMessage("⚠️ Failed to download video. Please try again later!");
      return;
    }

    const { title, mediaLink } = response.data.BK9[0];

    // Send the video file
    await sock.sendMessage(m.from, {
      video: { url: mediaLink },
      caption: `🎥 *${title}* has been successfully downloaded!\n🚀 POWERED BY BANDAHEALI`,
    }, { quoted: m });

    // React with success icon
    await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error(error);

    // Clear loading reaction and provide error feedback
    await sock.sendMessage(m.from, { react: { text: "❌", key: m.key } });
    await sendCommandMessage("❌ An error occurred while processing your request. Please try again later!");
  }
}

//POWERED BY BANDAHEALI

if (cmd === "mediafire" || cmd === "mf") {
  if (!url.includes('mediafire.com')) {
    await sendCommandMessage("⚠️ Please provide a valid Mediafire link!");
    return;
  }

  try {
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Fetch Mediafire file data
    const response = await axios.get(`https://api.davidcyriltech.my.id/mediafire?url=${url}`);
    const result = response.data;

    if (result && result.downloadLink) {
      const { fileName, downloadLink } = result;

      const tempFilePath = path.join('/tmp', fileName); // Temporary file path

      // Download file to local storage
      const fileResponse = await axios.get(downloadLink, { responseType: 'arraybuffer' });
      fs.writeFileSync(tempFilePath, fileResponse.data);

      // Send the file from local storage
      await sock.sendMessage(m.from, {
        document: { url: tempFilePath },
        fileName: fileName,
        mimetype: 'application/octet-stream',
        caption: `🔰 *Mediafire File Download* 🔰\n\n📄 *File Name:* ${fileName}\n🚀 POWERED BY BANDAHEALI`,
      }, { quoted: m });

      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);
    } else {
      await sendCommandMessage("⚠️ Failed to download the Mediafire file. Please try again later!");
    }
  } catch (error) {
    console.error(error);
    await sendCommandMessage("⚠️ An error occurred while fetching the Mediafire file. Please try again later!");
  }
}
// mp3 with yt-link
if (cmd === "ytmp3") {
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
    await sendCommandMessage("⚠️ Please provide a valid YouTube link!");
    return;
  }

  try {
    // React with loading icon while processing
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // API call for YouTube MP3 download
    const apiUrl = `https://api.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);

    if (!response.data.success || !response.data.result || !response.data.result.downloadUrl) {
      await sendCommandMessage("⚠️ Failed to download audio. Please try again later!");
      return;
    }

    const { title, image, downloadUrl } = response.data.result;

    // Send audio with details
    await sock.sendMessage(m.from, {
      audio: { url: downloadUrl },
      mimetype: 'audio/mp4',
      ptt: false,
    }, { quoted: m });

    // Send success message with caption
    const caption = `🎵 *${title}* has been successfully downloaded!\n🚀 POWERED BY BANDAHEALI`;
    await sendCommandMessage(caption);

    // React with success icon
    await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error(error);
    // Clear loading reaction and provide error feedback
    await sock.sendMessage(m.from, { react: { text: "❌", key: m.key } });
    await sendCommandMessage("❌ An error occurred while processing your request. Please try again later!");
  }
}
if (cmd === "ytmp4") {
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
    await sendCommandMessage("⚠️ Please provide a valid YouTube link!");
    return;
  }

  try {
    // React with loading icon
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    // Updated API se video data fetch kare
    const apiUrl = `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);

    if (response.data.status === 200 && response.data.success && response.data.result?.download_url) {
      const { title, download_url: videoUrl } = response.data.result;

      // Caption for the video
      const caption = `🎥 *${title}*\n🚀 POWERED BY BANDAHEALI`;

      // Send the video with caption
      await sock.sendMessage(m.from, {
        video: { url: videoUrl },
        caption,
      }, { quoted: m });

      // React with success icon
      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
    } else {
      await sendCommandMessage("⚠️ Failed to download the YouTube video. Please try again later!");
    }
  } catch (error) {
    console.error(error);
    await sendCommandMessage("⚠️ An error occurred while fetching the YouTube video. Please try again later!");
  }
}
};

export default DownloadCmd;