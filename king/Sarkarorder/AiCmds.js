import axios from 'axios';
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import config from '../../config.cjs';

const aiCommand = async (m, sock) => {
  const prefix = config.PREFIX;
  const pushName = m.pushName || 'User';

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const query = m.body.slice(prefix.length + cmd.length + 1).trim();
const sendCommandMessage = async (messageContent) => {
    await sock.sendMessage(
      m.from,
      {
        text: messageContent,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '', // Preserved newsletter JID
            newsletterName: "Sarkar-MD",
            serverMessageId: -1,
          },
          externalAdReply: {
            title: "✨ Sarkar-MD ✨",
            body: pushName,
            thumbnailUrl: '', // Thumbnail URL
            sourceUrl: 'https://github.com/Sarkar-Bandaheali/Sarkar-MD', // Source URL
            mediaType: 1,
            renderLargerThumbnail: false,
          },
        },
      },
      { quoted: m }
    );
  };
  
  
  if (cmd === "gpt") {
    if (!query) {
    await m.React('❌');
      await sendCommandMessage("Please provide a query for AI.");
      return;
    }

    try {
      const response = await axios.get(`https://api.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(query)}`);
      if (response.data.success) {
        const aiResponse = response.data.result;
        await sendCommandMessage(`${aiResponse}`);
        await m.React('🤖');
      } else {
        await sendCommandMessage("⚠️ Unable to fetch AI response.");
      }
    } catch (error) {
    await m.React('❌');
      await sendCommandMessage("❌ Error fetching AI response. Please try again.");
    }
  }
  
  if (cmd === "blackbox") {
  if (!query) {
    await m.React('❌');
    await sendCommandMessage("Please provide a query for Blackbox.");
    return;
  }

  try {
    const response = await axios.get(`https://api.davidcyriltech.my.id/blackbox?q=${encodeURIComponent(query)}`);
    if (response.data.success) {
      const blackboxResponse = response.data.response;
      await sendCommandMessage(`${blackboxResponse}`);
      await m.React('🧠');
    } else {
      await sendCommandMessage("⚠️ Unable to fetch Blackbox response.");
    }
  } catch (error) {
    await m.React('❌');
    await sendCommandMessage("❌ Error fetching Blackbox response. Please try again.");
  }
}
if (cmd === "llama") {
  if (!query) {
    await m.React('❌');
    await sendCommandMessage("Please provide a query for Llama.");
    return;
  }

  try {
    const response = await axios.get(`https://api.davidcyriltech.my.id/ai/llama3?text=${encodeURIComponent(query)}`);
    if (response.data.success) {
      const llamaResponse = response.data.response;
      await sendCommandMessage(`${llamaResponse}`);
      await m.React('🦙');
    } else {
      await sendCommandMessage("⚠️ Unable to fetch Llama response.");
    }
  } catch (error) {
    await m.React('❌');
    await sendCommandMessage("❌ Error fetching Llama response. Please try again.");
  }
}
if (cmd === "meta") {
  if (!query) {
    await m.React('❌');
    await sendCommandMessage("Please provide a query for Meta AI.");
    return;
  }

  try {
    const response = await axios.get(`https://api.davidcyriltech.my.id/ai/metaai?text=${encodeURIComponent(query)}`);
    if (response.data.success) {
      const metaResponse = response.data.response;
      await sendCommandMessage(`${metaResponse}`);
      await m.React('🤖');
    } else {
      await sendCommandMessage("⚠️ Unable to fetch Meta AI response.");
    }
  } catch (error) {
    await m.React('❌');
    await sendCommandMessage("❌ Error fetching Meta AI response. Please try again.");
  }
}
if (cmd === "claude") {
  if (!query) {
    await m.React('❌');
    await sendCommandMessage("Please provide a query for Claude.");
    return;
  }

  try {
    const response = await axios.get(`https://api.davidcyriltech.my.id/ai/claude?text=${encodeURIComponent(query)}`);
    if (response.data.success) {
      const claudeResponse = response.data.response;
      await sendCommandMessage(`${claudeResponse}`);
      await m.React('🤖');
    } else {
      await sendCommandMessage("⚠️ Unable to fetch Claude response.");
    }
  } catch (error) {
    await m.React('❌');
    await sendCommandMessage("❌ Error fetching Claude response. Please try again.");
  }
}
if (cmd === "mixtral") {
  if (!query) {
    await m.React('❌');
    await sendCommandMessage("Please provide a query for Claude.");
    return;
  }

  try {
    const response = await axios.get(`https://api.davidcyriltech.my.id/ai/mixtral?text=${encodeURIComponent(query)}`);
    if (response.data.success) {
      const mixTralResponse = response.data.response;
      await sendCommandMessage(`${mixTralResponse}`);
      await m.React('🤖');
    } else {
      await sendCommandMessage("⚠️ Unable to fetch mixtral response.");
    }
  } catch (error) {
    await m.React('❌');
    await sendCommandMessage("❌ Error fetching mixtral response. Please try again.");
  }
}

};

export default aiCommand;