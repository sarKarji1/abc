import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import os from "os";
import path from "path";
import config from "../../config.cjs";

const IMGUR_CLIENT_ID = "51c547f88a81855"; // Imgur Client ID

const fullpp = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : "";

  if (cmd === "fullpp") {
    try {
      if (!m.quoted || !m.quoted.message || !m.quoted.message.imageMessage) {
        throw "❌ *Please reply to an image to set as your profile picture!*";
      }

      await m.React("⏳"); // React with a loading emoji

      // Download image
      const fileBuffer = await m.quoted.download();
      if (!fileBuffer || fileBuffer.length === 0) {
        throw "❌ *Failed to download the image!*";
      }

      // Save image temporarily
      const tempFilePath = path.join(os.tmpdir(), `sarkar_temp_pp.jpg`);
      fs.writeFileSync(tempFilePath, fileBuffer);

      // Upload image to Imgur
      const formData = new FormData();
      formData.append("image", fs.createReadStream(tempFilePath));

      const apiUrl = `https://api.imgur.com/3/upload`;
      const response = await axios.post(apiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
      });

      if (!response.data || !response.data.data || !response.data.data.link) {
        throw "❌ *Error uploading image!*";
      }

      const mediaUrl = response.data.data.link;

      // Download the image from the uploaded URL
      const downloadImage = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
      });

      const newProfileBuffer = Buffer.from(downloadImage.data, "binary");

      // Set Profile Picture
      await sock.updateProfilePicture(m.sender, newProfileBuffer);
      fs.unlinkSync(tempFilePath); // Delete temp file

      await m.React("✅");
      await sock.sendMessage(
        m.from,
        { text: `✅ *Profile Picture Updated Successfully!*\n\n📌 *Image URL:* ${mediaUrl}` },
        { quoted: m }
      );
    } catch (error) {
      await m.React("❌");
      await sock.sendMessage(m.from, { text: `❌ Error: ${error.message || error}` }, { quoted: m });
      console.log(error);
    }
  }
};

export default fullpp;