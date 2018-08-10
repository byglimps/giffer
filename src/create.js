import { img } from "base64-img";
import { unlink } from "fs";
import { resolve as path_resolve } from "path";
import uuid from "uuid/v1";
import log from "./logger";
import i2b from "imageurl-base64";

import { createGif } from "./giffer";

const { HOST = "http://localhost:3002" } = process.env;

const cleanUp = async images => {
  return Promise.all(images.map(rm));
};

const rm = path => {
  return new Promise((resolve, reject) => {
    unlink(path, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const save = data => {
  return new Promise((resolve, reject) => {
    img(data, "tmp", uuid(), (err, location) => {
      err && reject(err);
      resolve(path_resolve(location));
    });
  });
};

const url2Buffer = url => {
  return new Promise((resolve, reject) => {
    i2b(url, (err, data) => {
      err && reject(err);
      resolve(`data:image/jpg;base64,${data.base64}`);
    });
  });
};

const createStory = async (storyImages, brand) => {
  let imagePaths = [];
  for (var shot of storyImages) {
    let loc = await save(shot.base64);
    imagePaths = imagePaths.concat([loc]);
  }

  const brandBuffer = await url2Buffer(brand);
  const brandLoc = await save(brandBuffer);

  imagePaths.push(brandLoc);
  let gif = await createGif(imagePaths);
  log({ imagePaths });

  log({ gif });
  await cleanUp(imagePaths);

  return gif;
};

const validateReq = (images, brand, eventName) => {
  return new Promise((resolve, reject) => {
    var err = [];
    if (!images || images.length < 3) {
      err.push({
        story: "story should be an array of 3 images in base64 format."
      });
    }
    if (!brand) {
      err.push({ brandImage: "The url to a brand image should be provided." });
    }
    if (!eventName) {
      err.push({ eventName: "An eventName should be provided" });
    }

    if (err.length > 0) {
      reject(err);
    }

    resolve();
  });
};

const makeDevUrl = filePath => {
  return `${HOST}/tmp/${filePath}`;
};

const create = async (req, res) => {
  try {
    const { story: storyImages, brandImage, eventName } = req.body;
    await validateReq(storyImages, brandImage, eventName);

    let story = await createStory(storyImages, brandImage);

    return res
      .status(200)
      .json({ success: true, data: makeDevUrl(story.file_name) });
  } catch (e) {
    res.send({ success: false, msg: e });
  }
};

export default create;
