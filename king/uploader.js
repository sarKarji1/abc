import axios from 'axios';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';
import * as cheerio from 'cheerio';
import mime from 'mime';

// Utility function to check if a file exists
const fileExists = (path) => {
  if (!fs.existsSync(path)) throw new Error("File not Found");
};

export const TelegraPh = async (path) => {
  fileExists(path);
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(path));
    const { data } = await axios.post("https://telegra.ph/upload", form, {
      headers: { ...form.getHeaders() },
    });
    return "https://telegra.ph" + data[0].src;
  } catch (err) {
    throw new Error(`Telegraph Upload Error: ${err.message}`);
  }
};

export const UploadFileUgu = async (path) => {
  fileExists(path);
  try {
    const form = new FormData();
    form.append("files[]", fs.createReadStream(path));
    const { data } = await axios.post("https://uguu.se/upload.php", form, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        ...form.getHeaders(),
      },
    });
    return data.files[0];
  } catch (err) {
    throw new Error(`Uguu Upload Error: ${err.message}`);
  }
};

export const webp2mp4File = async (path) => {
  fileExists(path);
  try {
    const form = new FormData();
    form.append("new-image-url", "");
    form.append("new-image", fs.createReadStream(path));

    const { data: step1Data } = await axios.post(
      "https://s6.ezgif.com/webp-to-mp4",
      form,
      { headers: { ...form.getHeaders() } }
    );

    const $ = cheerio.load(step1Data);
    const file = $('input[name="file"]').attr("value");

    if (!file) throw new Error("Failed to fetch file key for conversion");

    const formThen = new FormData();
    formThen.append("file", file);
    formThen.append("convert", "Convert WebP to MP4!");

    const { data: step2Data } = await axios.post(
      `https://ezgif.com/webp-to-mp4/${file}`,
      formThen,
      { headers: { ...formThen.getHeaders() } }
    );

    const $2 = cheerio.load(step2Data);
    const result =
      "https:" + $2('div#output > p.outfile > video > source').attr("src");

    if (!result) throw new Error("Conversion failed: No output file found");

    return {
      status: true,
      message: "Conversion Successful",
      result,
    };
  } catch (err) {
    throw new Error(`WebP to MP4 Conversion Error: ${err.message}`);
  }
};

export const floNime = async (path) => {
  fileExists(path);
  const ext = mime.getType(path);
  if (!ext) throw new Error("Unknown file type");

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(path), `tmp.${ext}`);
    const response = await fetch("https://flonime.my.id/upload", {
      method: "POST",
      body: form,
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.statusText}`);

    const json = await response.json();
    return json;
  } catch (err) {
    throw new Error(`FloNime Upload Error: ${err.message}`);
  }
};

// Export all functions
export default {
  TelegraPh,
  UploadFileUgu,
  webp2mp4File,
  floNime,
};
