import uuid from "uuid/v1";
import { resolve as path_resolve } from "path";

import gm from "gm";
import Jimp from "jimp";

const getDestInfo = () => {
  const fileName = `c_${uuid()}.gif`;
  return {
    file_name: fileName,
    file_path: path_resolve(`tmp/${fileName}`)
  };
};

/**
 * @param {string} path
 */
const getImageInfo = async path => {
  const { bitmap } = await Jimp.read(path);
  return bitmap;
};

/**
 * @param {string} dest
 * @param {string} brandPath
 */
const brandOverlay = async (dest, brandPath) => {
  const { width, height } = await getImageInfo(brandPath);

  return new Promise((resolve, reject) => {
    gm(dest.file_path)
      .draw([`image Over 350,50 ${width},${height} ${brandPath}`])
      .write(dest.file_path, err => {
        if (err) reject(err);
        resolve();
      });
  });
};

/**
 * Creates a giff, with 4 images
 * @param {Array<string>} files
 * @returns {Promise<{file_name: string, file_path: string}>}
 */
const createGif = async (imagePaths, brandPath) => {
  return new Promise(resolve => {
    const dest = getDestInfo();

    let gmi = gm();

    images.map(img => img && gmi.in(img));

    gmi
      .delay(40)
      .resize(1280, 960)
      .gravity("Center")
      .write(dest.file_path, async err => {
        if (err) throw err;
        await brandOverlay(dest, brandPath);
        resolve(dest);
      });
  });
};

export { createGif };
