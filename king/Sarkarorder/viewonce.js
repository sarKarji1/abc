import pkg from '@whiskeysockets/baileys';
const { downloadMediaMessage } = pkg;
import config from '../../config.cjs';

const OwnerCmd = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const isOwner = m.sender === ownerNumber;
  const isBot = m.sender === botNumber;

  if (cmd === 'antiviewonce') {
    if (!isOwner && !isBot) return m.reply('❌ *Only the owner or bot can use this command!*');
    if (!m.quoted) return m.reply('⚠️ *Reply to a View Once message!*');

    let msg = m.quoted.message;
    if (msg.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message;
    else if (msg.viewOnceMessage) msg = msg.viewOnceMessage.message;

    if (!msg) return m.reply('❌ *This is not a View Once message!*');

    try {
      const messageType = Object.keys(msg)[0];
      let buffer;
      if (messageType === 'audioMessage') {
        buffer = await downloadMediaMessage(m.quoted, 'buffer', {}, { type: 'audio' });
      } else {
        buffer = await downloadMediaMessage(m.quoted, 'buffer');
      }

      if (!buffer) return m.reply('❌ *Failed to retrieve media!*');

      let mimetype = msg.audioMessage?.mimetype || 'audio/ogg';
      let caption = `🔓 *View Once Media Unlocked*`;

      if (messageType === 'imageMessage') {
        await Matrix.sendMessage(m.from, { image: buffer, caption }, { quoted: m });
      } else if (messageType === 'videoMessage') {
        await Matrix.sendMessage(m.from, { video: buffer, caption, mimetype: 'video/mp4' }, { quoted: m });
      } else if (messageType === 'audioMessage') {  
        await Matrix.sendMessage(m.from, { audio: buffer, mimetype, ptt: true }, { quoted: m });
      } else {
        return m.reply('❌ *Unsupported media type!*');
      }
    } catch (error) {
      await m.reply('❌ *Failed to process View Once message!*');
    }
  }
};

// POWERED BY BANDAHEALI
export default OwnerCmd;