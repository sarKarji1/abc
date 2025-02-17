import axios from 'axios';
import config from '../../config.cjs';

const DownloadCmd2 = async (m, sock) => {
  const prefix = config.PREFIX;
  const pushName = m.pushName || 'User';
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  // Helper function to send messages with context
  const sendMessageWithContext = async (text, thumbnailUrl = '', sourceUrl = '') => {
    const messagePayload = {
      text: text,
      contextInfo: {
        externalAdReply: {
          title: "✨ Sarkar-MD ✨",
          body: pushName,
          thumbnailUrl: thumbnailUrl,
          sourceUrl: sourceUrl,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    };
    await sock.sendMessage(m.from, messagePayload, { quoted: m });
  };

  // Helper function to send video messages
  const sendVideoMessage = async (videoUrl, caption, thumbnailUrl, sourceUrl) => {
    const videoMessage = {
      video: { url: videoUrl },
      caption: caption,
      contextInfo: {
        externalAdReply: {
          title: "✨ Sarkar-MD ✨",
          body: pushName,
          thumbnailUrl: thumbnailUrl,
          sourceUrl: sourceUrl,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    };
    await sock.sendMessage(m.from, videoMessage, { quoted: m });
  };

  // Helper function to send audio messages
  const sendAudioMessage = async (audioUrl, caption, thumbnailUrl, sourceUrl) => {
    const audioMessage = {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      caption: caption,
      contextInfo: {
        externalAdReply: {
          title: "✨ Sarkar-MD ✨",
          body: pushName,
          thumbnailUrl: thumbnailUrl,
          sourceUrl: sourceUrl,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    };
    await sock.sendMessage(m.from, audioMessage, { quoted: m });
  };
  const sendFileMessage = async (fileUrl, fileName, mimeType, caption, thumbnailUrl = '') => {
  const fileMessage = {
    document: { url: fileUrl },
    mimetype: mimeType,
    fileName: fileName,
    caption: caption,
    contextInfo: {
      externalAdReply: {
        title: "✨ Sarkar-MD ✨",
        body: pushName,
        thumbnailUrl: thumbnailUrl,
        sourceUrl: fileUrl,
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  };
  await sock.sendMessage(m.from, fileMessage, { quoted: m });
};

  // Facebook Video Downloader
  if (cmd === "facebook3" || cmd === "fb3") {
    const fbUrl = m.body.slice(prefix.length + cmd.length + 1).trim();
    if (!fbUrl || !fbUrl.includes("facebook.com")) {
      await sendMessageWithContext("⚠️ Please provide a valid Facebook video link!");
      return;
    }

    try {
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      const fbApiUrl = `https://api.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(fbUrl)}`;
      const fbResponse = await axios.get(fbApiUrl);
      const fbResult = fbResponse.data.video;

      if (fbResult && fbResult.downloads.length > 0) {
        const videoTitle = fbResult.title || "No Title";
        const videoThumbnail = fbResult.thumbnail || "";
        const hdVideo = fbResult.downloads.find((v) => v.quality === "HD");
        const sdVideo = fbResult.downloads.find((v) => v.quality === "SD");

        const selectedVideo = hdVideo ? hdVideo.downloadUrl : sdVideo ? sdVideo.downloadUrl : null;

        if (selectedVideo) {
          const caption = `🎥 *Title:* ${videoTitle}\n> POWERED BY BANDAHEALI && SHABAN-MD`;
          await sendVideoMessage(selectedVideo, caption, videoThumbnail, fbUrl);
          await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
        } else {
          await sendMessageWithContext("⚠️ No downloadable Facebook video found.");
        }
      } else {
        await sendMessageWithContext("⚠️ Facebook video not found!");
      }
    } catch (error) {
      console.error(error);
      await sendMessageWithContext("⚠️ An error occurred while processing your request.");
    }
  }

  // TikTok Video Downloader
  if (cmd === "tiktok2" || cmd === "tt2") {
    const ttUrl = m.body.slice(prefix.length + cmd.length + 1).trim();
    if (!ttUrl || !ttUrl.includes("tiktok.com")) {
      await sendMessageWithContext("⚠️ Please provide a valid TikTok video link!");
      return;
    }

    try {
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      const ttApiUrl = `https://api.davidcyriltech.my.id/download/tiktok?url=${encodeURIComponent(ttUrl)}`;
      const ttResponse = await axios.get(ttApiUrl);
      const ttResult = ttResponse.data.result;

      if (ttResult && ttResult.video) {
        const caption = `🎵 *TikTok Video*\n👤 *User:* ${ttResult.author.nickname}\n❤️ *Likes:* ${ttResult.statistics.likeCount}\n💬 *Comments:* ${ttResult.statistics.commentCount}\n🔄 *Shares:* ${ttResult.statistics.shareCount}\n\n> ${ttResult.desc || 'No Description'}\n> POWERED BY BANDAHEALI && SHABAN-MD`;

        await sendVideoMessage(ttResult.video, caption, ttResult.author.avatar || '', ttUrl);
        await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
      } else {
        await sendMessageWithContext("⚠️ TikTok video not found!");
      }
    } catch (error) {
      console.error(error);
      await sendMessageWithContext("⚠️ An error occurred while processing your request.");
    }
  }

  // Twitter Video Downloader
  if (cmd === "twitter2" || cmd === "twit2") {
    const twitterUrl = m.body.slice(prefix.length + cmd.length + 1).trim();
    if (!twitterUrl || !twitterUrl.includes("twitter.com") && !twitterUrl.includes("x.com")) {
      await sendMessageWithContext("⚠️ Please provide a valid Twitter (X) video link!");
      return;
    }

    try {
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      const twitterApiUrl = `https://api.davidcyriltech.my.id/twitter?url=${encodeURIComponent(twitterUrl)}`;
      const twitterResponse = await axios.get(twitterApiUrl);
      const twitterResult = twitterResponse.data;

      if (twitterResult && twitterResult.success) {
        const caption = `🐦 *Twitter Video*\n> POWERED BY BANDAHEALI && SHABAN-MD`;

        // Send HD video if available, otherwise send SD video
        const videoUrl = twitterResult.video_hd || twitterResult.video_sd;
        if (videoUrl) {
          await sendVideoMessage(videoUrl, caption, twitterResult.thumbnail, twitterUrl);
          await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
        } else {
          await sendMessageWithContext("⚠️ No downloadable Twitter video found.");
        }
      } else {
        await sendMessageWithContext("⚠️ Twitter video not found!");
      }
    } catch (error) {
      console.error(error);
      await sendMessageWithContext("⚠️ An error occurred while processing your request.");
    }
  }

  // Twitter Audio Downloader
  if (cmd === "twitaudio" || cmd === "twitteraudio") {
  const twitterUrl = m.body.slice(prefix.length + cmd.length + 1).trim();
  if (!twitterUrl || (!twitterUrl.includes("twitter.com") && !twitterUrl.includes("x.com"))) {
    await sendMessageWithContext("⚠️ Please provide a valid Twitter (X) video link!");
    return;
  }

  try {
    await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

    const twitterApiUrl = `https://api.davidcyriltech.my.id/twitter?url=${encodeURIComponent(twitterUrl)}`;
    const twitterResponse = await axios.get(twitterApiUrl);
    console.log("API Response:", twitterResponse.data); // Log the API response

    const twitterResult = twitterResponse.data;

    if (twitterResult && twitterResult.success) {
      console.log("Audio URL:", twitterResult.audio); // Log the audio URL
      if (twitterResult.audio) {
        const caption = `🎧 *Twitter Audio*\n> POWERED BY BANDAHEALI && SHABAN-MD`;
        await sendAudioMessage(twitterResult.audio, caption, twitterResult.thumbnail, twitterUrl);
        await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
      } else {
        await sendMessageWithContext("⚠️ No downloadable Twitter audio found.");
      }
    } else {
      await sendMessageWithContext("⚠️ Twitter audio not found!");
    }
  } catch (error) {
    console.error("API Error:", error.response ? error.response.data : error.message); // Log detailed error
    await sendMessageWithContext("⚠️ An error occurred while processing your request.");
  }
}
  // MediaFire Downloader
  if (cmd === "mediafire2" || cmd === "mf2") {
    const mediafireUrl = m.body.slice(prefix.length + cmd.length + 1).trim();
    if (!mediafireUrl || !mediafireUrl.includes("mediafire.com")) {
      await sendMessageWithContext("⚠️ Please provide a valid MediaFire link!");
      return;
    }

    try {
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      const mediafireApiUrl = `https://api.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(mediafireUrl)}`;
      const mediafireResponse = await axios.get(mediafireApiUrl);
      console.log("API Response:", mediafireResponse.data); // Log the API response

      const mediafireResult = mediafireResponse.data;

      if (mediafireResult && mediafireResult.downloadLink) {
        const caption = `📁 *File Name:* ${mediafireResult.fileName}\n📦 *Size:* ${mediafireResult.size}\n\n> POWERED BY BANDAHEALI && SHABAN-MD`;
        await sendFileMessage(mediafireResult.downloadLink, mediafireResult.fileName, mediafireResult.mimeType, caption);
        await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
      } else {
        await sendMessageWithContext("⚠️ No downloadable file found.");
      }
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message); // Log detailed error
      await sendMessageWithContext("⚠️ An error occurred while processing your request.");
    }
  }
  // Spotify Downloader
  if (cmd === "spotify2" || cmd === "spot2") {
    const spotifyUrl = m.body.slice(prefix.length + cmd.length + 1).trim();
    if (!spotifyUrl || !spotifyUrl.includes("open.spotify.com")) {
      await sendMessageWithContext("⚠️ Please provide a valid Spotify track link!");
      return;
    }

    try {
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      const spotifyApiUrl = `https://api.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(spotifyUrl)}`;
      const spotifyResponse = await axios.get(spotifyApiUrl);
      console.log("API Response:", spotifyResponse.data); // Log the API response

      const spotifyResult = spotifyResponse.data;

      if (spotifyResult && spotifyResult.success) {
        const caption = `🎵 *Title:* ${spotifyResult.title}\n🎤 *Artist:* ${spotifyResult.channel}\n⏱️ *Duration:* ${spotifyResult.duration}\n\n> POWERED BY BANDAHEALI && SHABAN-MD`;
        await sendAudioMessage(spotifyResult.DownloadLink, caption, spotifyResult.thumbnail, spotifyUrl);
        await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
      } else {
        await sendMessageWithContext("⚠️ No downloadable Spotify track found.");
      }
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message); // Log detailed error
      await sendMessageWithContext("⚠️ An error occurred while processing your request.");
    }
  }
  
  // Google Drive Downloader
  if (cmd === "gdrive" || cmd === "gd") {
    const gdriveUrl = m.body.slice(prefix.length + cmd.length + 1).trim();
    if (!gdriveUrl || !gdriveUrl.includes("drive.google.com")) {
      await sendMessageWithContext("⚠️ Please provide a valid Google Drive link!");
      return;
    }

    try {
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      const gdriveApiUrl = `https://api.davidcyriltech.my.id/gdrive?url=${encodeURIComponent(gdriveUrl)}`;
      const gdriveResponse = await axios.get(gdriveApiUrl);
      

      const gdriveResult = gdriveResponse.data;

      if (gdriveResult && gdriveResult.success) {
        const downloadLink = gdriveResult.download_link;

        // Fetch the actual file URL by following redirects
        const fileResponse = await axios.get(downloadLink, { maxRedirects: 5, responseType: 'stream' });
        const actualFileUrl = fileResponse.request.res.responseUrl; // Get the final URL after redirects

        const caption = `📁 *File Name:* ${gdriveResult.name}\n\n> POWERED BY BANDAHEALI && SHABAN-MD`;
        await sendFileMessage(actualFileUrl, gdriveResult.name, 'application/octet-stream', caption);
        await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
      } else {
        await sendMessageWithContext("⚠️ No downloadable file found.");
      }
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message); // Log detailed error
      await sendMessageWithContext("⚠️ An error occurred while processing your request.");
    }
  }

  // APK Downloader
  if (cmd === "apk" || cmd === "apkdl") {
    const apkName = m.body.slice(prefix.length + cmd.length + 1).trim();
    if (!apkName) {
      await sendMessageWithContext("⚠️ Please provide an APK name! Example: `!apk whatsapp`");
      return;
    }

    try {
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      const apkApiUrl = `https://api.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(apkName)}`;
      const apkResponse = await axios.get(apkApiUrl);
      console.log("API Response:", apkResponse.data); // Log the API response

      const apkResult = apkResponse.data;

      if (apkResult && apkResult.success) {
        const caption = `📱 *APK Name:* ${apkResult.apk_name}\n\n> POWERED BY BANDAHEALI && SHABAN-MD`;
        await sendFileMessage(apkResult.download_link, `${apkResult.apk_name}.apk`, 'application/vnd.android.package-archive', caption, apkResult.thumbnail);
        await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
      } else {
        await sendMessageWithContext("⚠️ No downloadable APK found.");
      }
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message); // Log detailed error
      await sendMessageWithContext("⚠️ An error occurred while processing your request.");
    }
  }

};

export default DownloadCmd2;