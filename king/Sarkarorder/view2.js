import pkg from '@whiskeysockets/baileys';
const { downloadMediaMessage } = pkg;
import config from '../../config.cjs';

const OwnerCmd = async (m, Matrix) => {
  const botNumber = Matrix.user.id.split(':')[0] + '@s.whatsapp.net';
  const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const isOwner = m.sender === ownerNumber;
  const isBot = m.sender === botNumber;

  if (!['vv', 'vv2', 'vv3'].includes(cmd)) return;
  if (!m.quoted) return m.reply('⚠️ *Reply to a View Once message!*');

  let msg = m.quoted.message;
  if (msg.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message;
  else if (msg.viewOnceMessage) msg = msg.viewOnceMessage.message;

  if (!msg) return m.reply('❌ *This is not a View Once message!*');

  // VV2 & VV3 only for Owner/Bot
  if (['vv2', 'vv3'].includes(cmd) && !isOwner && !isBot) {
    return m.reply('❌ *Only the owner or bot can use this command!*');
  }

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
    let caption = `🔓 *View Once Media Unlocked!*`;

    let recipient;
    if (cmd === 'vv') {
      recipient = m.from; // Same chat
    } else if (cmd === 'vv2') {
      recipient = botNumber; // ✅ Bot ke inbox me save hoga
    } else if (cmd === 'vv3') {
      recipient = ownerNumber; // ✅ Owner ke inbox me send hoga
    }

    if (messageType === 'imageMessage') {
      await Matrix.sendMessage(recipient, { image: buffer, caption });
    } else if (messageType === 'videoMessage') {
      await Matrix.sendMessage(recipient, { video: buffer, caption, mimetype: 'video/mp4' });
    } else if (messageType === 'audioMessage') {  
      await Matrix.sendMessage(recipient, { audio: buffer, mimetype, ptt: true });
    } else {
      return m.reply('❌ *Unsupported media type!*');
    }

    return m.reply(`✅ *View Once message unlocked and sent to ${cmd === 'vv' ? 'this chat' : cmd === 'vv2' ? 'bot inbox' : 'owner'}!*`);

  } catch (error) {
    console.error(error);
    await m.reply('❌ *Failed to process View Once message!*');
  }
};

// POWERED BY BANDAHEALI
export default OwnerCmd;