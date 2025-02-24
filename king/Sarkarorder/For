import axios from 'axios';
import config from '../../config.cjs';

const snackVideoDownloader = async (message, client) => {
  const prefix = config.PREFIX;
  const command = message.body.startsWith(prefix)
    ? message.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : '';
  const args = message.body.slice(prefix.length + command.length).trim();
  const validCommands = ["snack", "snackvideo", "svdl"];
  if (validCommands.includes(command)) {
    if (!args) {
      return client.sendMessage(message.from, {
        text: `Please provide a Snack Video URL. Example usage: ${prefix}${command} <Snack Video URL>`
      });
      if (!/^https?:\/\/(www\.)?snackvideo\.com\/.*$/.test(args)) {
      return client.sendMessage(message.from, {
        text: "Invalid Snack Video URL. Please provide a valid Snack Video link."
      });

      try {
      await client.sendMessage(message.from, { text: "*Downlaoding the video, please wait...*" });
      const apiEndpoint = `https://api.siputzx.my.id/api/d/snackvideo?url=${encodeURIComponent(args)}`;
      console.log("Fetching URL:", apiEndpoint); // Debug log
      const response = await axios.get(apiEndpoint);
      console.log("API Response:", response.data); // Debug log
      if (response.status === 200 && response.data?.status) {
        const videoData = response.data.data;
        if (videoData?.videoUrl) {
          await client.sendMessage(message.from, {
            video: { url: videoData.videoUrl },
            caption: `*DOWNLOADED BY Sarkar-MD*`
          });
        } else {
          throw new Error("Video URL not found in API response.");
        }
      } else {
        throw new Error(response.data?.message || "API returned an error.");
      }
    } catch (error) {
      console.error("Error downloading Snack Video:", error.message || error);
      await client.sendMessage(message.from, {
        text: "*Oops! Something went wrong while downloading the video. Please try again later.*"
      });

        export default snackVideoDownloader;
