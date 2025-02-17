import config from '../../config.cjs';

const DeleteCmd = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const isOwner = m.sender === ownerNumber;
  const isBot = m.sender === botNumber;
  const isGroup = m.isGroup;
  const isAdmins = m.isAdmins || isOwner; // ✅ Owner hamesha admin hoga
  const isBotAdmins = m.isBotAdmins;

  if (cmd === 'delete' || cmd === 'del') {
    if (!isGroup) return m.reply('❌ *This command can only be used in groups!*');
    if (!isAdmins) return m.reply('❌ *Only Admins & Owner can use this command!*');
    if (!m.quoted) return m.reply('⚠️ *Reply to a message to delete it!*');

    try {
      const key = {
        remoteJid: m.chat,
        fromMe: false,
        id: m.quoted.id,
        participant: m.quoted.sender
      };

      await Matrix.sendMessage(m.chat, { delete: key });
      m.reply('✅ *Message deleted successfully!*');
    } catch (e) {
      console.error("Error in delete command:", e);
      m.reply('❌ *Failed to delete message!*');
    }
  }
};

// POWERED BY BANDAHEALI
export default DeleteCmd;