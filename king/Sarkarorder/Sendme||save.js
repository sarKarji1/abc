import pkg from '@whiskeysockets/baileys';
const { downloadMediaMessage } = pkg;
import config from '../../config.cjs';

const MediaHandler = async (m, Matrix) => {
  const botNumber = Matrix.user.id.split(':')[0] + '@s.whatsapp.net';
  const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';

  const isOwner = m.sender === ownerNumber;
  const isBot = m.sender === botNumber;
  const isGroup = m.isGroup;

  // ✅ Commands for Users (Send Media Silently) - Only in Inbox
  const sendMeCmds = ['sendme', 'sentme', 'send', 'snd'];

  // ✅ Command for Owner (Save Media) - Works Everywhere
  const saveCmds = ['save'];

  let cmd;
  if (sendMeCmds.includes(m.body.toLowerCase())) cmd = 'sendme';
  else if (saveCmds.includes(m.body.toLowerCase())) cmd = 'save';
  else return;

  // ❌ "sendme" Commands Work Only in Private Chats (Inbox)
  if (cmd === 'sendme' && isGroup) return;

  // ❌ Owner & Bot cannot use "sendme" commands
  if (cmd === 'sendme' && (isOwner || isBot)) return;

  // ❌ Only Owner can use "save" command
  if (cmd === 'save' && !isOwner) return;

  // ✅ Only Works When Replying to a Media Message
  if (!m.quoted) return;
  let msg = m.quoted.message;
  if (!msg) return;

  const messageType = Object.keys(msg)[0];
  if (!['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'].includes(messageType)) return;

  try {
    // ✅ Download Media
    let buffer = await downloadMediaMessage(m.quoted, 'buffer');
    if (!buffer) return;

    let recipient = cmd === 'sendme' ? m.sender : ownerNumber; // User for sendme, Owner for save

    if (messageType === 'imageMessage') {
      await Matrix.sendMessage(recipient, { image: buffer });
    } else if (messageType === 'videoMessage') {
      await Matrix.sendMessage(recipient, { video: buffer, mimetype: 'video/mp4' });
    } else if (messageType === 'audioMessage') {
      let mimetype = msg.audioMessage?.mimetype || 'audio/ogg';
      let isPtt = msg.audioMessage?.ptt || false;
      await Matrix.sendMessage(recipient, { audio: buffer, mimetype, ptt: isPtt });
    } else if (messageType === 'documentMessage') {
      await Matrix.sendMessage(recipient, { document: buffer, mimetype: msg.documentMessage.mimetype, fileName: 'saved_file' });
    }

    // ✅ No reply to user - Silent Action
  } catch (error) {
    console.error(error);
  }
};

// POWERED BY BANDAHEALI
export default MediaHandler;
