import uuid from "uuid/v1";
import { resolve as path_resolve } from "path";

import gm from "gm";

const getDestInfo = id => {
  const fileName = `c_${id}.gif`;
  return {
    file_name: fileName,
    file_path: path_resolve(`tmp/${fileName}`)
  };
};

/**
 * Creates a giff, with 4 images
 * @param {Array<string>} files
 * @returns {Promise<{file_name: string, file_path: string}>}
 */
const createGif = async imagePaths => {
  return new Promise(resolve => {
    const id = uuid();
    gm()
      .in(imagePaths[0])
      .in(imagePaths[1])
      .in(imagePaths[2])
      .in(imagePaths[3])
      .delay(50)
      .resize(640, 480)
      .write(path_resolve(`tmp/c_${id}.gif`), err => {
        if (err) throw err;
        const dest = getDestInfo(id);
        resolve(dest);
      });
  });
};

export { createGif };
