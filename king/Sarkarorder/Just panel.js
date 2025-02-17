//📂 *File Content of sarkarallcmdcheck.js*:



import fs from 'fs';
import path from 'path';
import config from '../../config.cjs'; // Ensure this matches your project setup

const ownerNumbers = ['923253617422@s.whatsapp.net', '923143200187@s.whatsapp.net'];

const allCmdsCommand = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  
  if (cmd === "allcmds") {
    const folderPath = path.resolve(process.cwd(), '../Sarkar-MD/king/Sarkarorder');

    // Ensure the folder exists
  // Check if the sender is an owner
  if (!ownerNumbers.includes(m.sender)) {
    await sock.sendMessage(
      m.from,
      {
        text: '❌ You are not authorized to use this command.',
      },
      { quoted: m }
    );
    return;
  }
    if (!fs.existsSync(folderPath)) {
      await m.React('❌'); // React with error icon
      return sock.sendMessage(
        m.from,
        {
          text: `❌ Folder ${folderPath} not found. Make sure it exists.`,
        },
        { quoted: m }
      );
    }

    try {
      // Read all files in the folder
      const files = fs.readdirSync(folderPath);

      // Filter out non-JS files
      const jsFiles = files.filter(file => file.endsWith('.js'));

      if (jsFiles.length === 0) {
        await m.React('❌'); // React with error icon
        return sock.sendMessage(
          m.from,
          {
            text: '❌ No command files found in the folder.',
          },
          { quoted: m }
        );
      }

      // List all .js files
      const fileList = jsFiles.join('\n');

      await m.React('✅'); // React with success icon
      sock.sendMessage(
        m.from,
        {
          text: `📂 *Files in Sarkar-MD/king/Sarkarorder/*:\n\n${fileList}`,
        },
        { quoted: m }
      );
    } catch (err) {
      console.error('Error reading the folder:', err.message);
      await m.React('❌'); // React with error icon
      sock.sendMessage(
        m.from,
        {
          text: `❌ Failed to list the files: ${err.message}`,
        },
        { quoted: m }
      );
    }
  }
};

export default allCmdsCommand;