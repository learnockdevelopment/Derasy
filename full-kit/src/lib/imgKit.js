// lib/imgkit.js
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Uploads a file to ImageKit
 * @param {File} file - The file to upload (from FormData)
 * @param {string} path - Path to store the image (e.g. 'children/userId/image_123')
 * @returns {Promise<{ secure_url: string, publicId: string }>}
 */
export async function upload(file, path) {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  const uploadResponse = await imagekit.upload({
    file: `data:${file.type};base64,${base64}`,
    fileName: path.replace(/\//g, "_"), // e.g. 'children_userId_image_123'
    folder: path.split("/").slice(0, -1).join("/"), // e.g. 'children/userId'
  });

  return {
    secure_url: uploadResponse.url,
    publicId: uploadResponse.fileId,
  };
}
