import axios from 'axios';
import config from '../../config.cjs';

const LogoCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const pushName = m.pushName || 'User';

  // Extract the command name (should be "logo", "logo1", or "logo2")
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  // Helper function to send a text message with context info
  const sendCommandMessage = async (messageContent) => {
    const messagePayload = {
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
          thumbnailUrl:
            'https://raw.githubusercontent.com/Sarkar-Bandaheali/BALOCH-MD_DATABASE/refs/heads/main/Pairing/1733805817658.webp',
          sourceUrl: 'https://github.com/Sarkar-Bandaheali/Sarkar-MD',
          mediaType: 1,
          renderLargerThumbnail: false,
        },
      },
    };

    await sock.sendMessage(m.from, messagePayload, { quoted: m });
  };

  // Define API URLs for the commands
  const apiUrls = {
    logo: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html&name=',
    logo1: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html&name=',
    logo2: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html&name=',
    logo3: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html&name=',
    logo4: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html&name=',
    logo5: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html&name=',
    logo6: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html&name=',
    logo7: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html&name=',
    logo8: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/free-bear-logo-maker-online-673.html&name=',
    logo9: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html&name=',
    logo10: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/write-text-on-wet-glass-online-589.html&name=',
    logo11: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-typography-status-online-with-impressive-leaves-357.html&name=',
    logo12: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html&name=',
    logo13: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html&name=',
    logo14: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html&name=',
    logo15: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-3d-castle-pop-out-mobile-photo-effect-786.html&name=',
    logo16: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html&name=',
    logo17: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/beautiful-3d-foil-balloon-effects-for-holidays-and-birthday-803.html&name=',
    logo18: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html&name=',
    logo19: 'https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html&name=',
  };

  // Handle "logo", "logo1", and "logo2" commands
  if (cmd === "logo" || cmd === "logo1" || cmd === "logo2" || cmd === "logo3" || cmd === "logo4" || cmd === "logo5" || cmd === "logo6" || cmd === "logo7" || cmd === "logo8" || cmd === "logo9" || cmd === "logo10" || cmd === "logo11" || cmd === "logo12" || cmd === "logo13" ||cmd === "logo14" || cmd === "logo15" || cmd === "logo16" || cmd === "logo17" || cmd === "logo18" || cmd === "logo19")
   {
    // Extract the text after the command; this text is used for the logo
    const text = m.body.slice(prefix.length + cmd.length + 1).trim();
    if (!text) {
      await sendCommandMessage("⚠️ Please provide text to generate a logo!");
      return;
    }

    try {
      // React to the user that processing has started
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      // Build the API URL using the provided text (make sure to URL-encode it)
      const apiUrl = `${apiUrls[cmd]}${encodeURIComponent(text)}`;

      // Fetch the logo data from the API
      const response = await axios.get(apiUrl);
      const result = response.data;

      // Check if the response is successful and contains a download_url
      if (result.status && result.result && result.result.download_url) {
        const logoUrl = result.result.download_url;
        const caption = `Here is your logo for ${text}\n> POWERED BY BANDAHEALI && SHOBAN`;

        // Create a message payload with the image and caption
        const messagePayload = {
          image: { url: logoUrl },
          caption: caption,
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
              thumbnailUrl:
                'https://raw.githubusercontent.com/Sarkar-Bandaheali/BALOCH-MD_DATABASE/refs/heads/main/Pairing/1733805817658.webp',
              sourceUrl: 'https://github.com/Sarkar-Bandaheali/Sarkar-MD',
              mediaType: 1,
              renderLargerThumbnail: false,
            },
          },
        };

        // Send the image message
        await sock.sendMessage(m.from, messagePayload, { quoted: m });
        // React to indicate success
        await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });
      } else {
        await sendCommandMessage("⚠️ Failed to generate the logo. Please try again later!");
      }
    } catch (error) {
      console.error(error);
      await sendCommandMessage("⚠️ An error occurred while generating the logo. Please try again later!");
    }
  }
};

export default LogoCmd;