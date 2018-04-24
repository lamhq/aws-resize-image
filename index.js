'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});
const Sharp = require('sharp');

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;
const ALLOWED_RESOLUTIONS = process.env.ALLOWED_RESOLUTIONS ?
  new Set(process.env.ALLOWED_RESOLUTIONS.split(/\s*,\s*/)) : new Set([]);

async function resize(input, width, height) {
  const img = Sharp(input);
  const { width: orgWidth, height: orgHeight } = await img.metadata();
  let w, h, nw = parseInt(width, 10), nh = parseInt(height);
  if (!width && height) {
    w = Math.round((nh * orgWidth) / orgHeight);
    h = nh;
  } else if (!height && width) {
    w = nw;
    h = Math.round((nw * orgHeight) / orgWidth);
  } else {
    w = nw;
    h = nh;
  }
  return img
    .resize(w, h)
    .toFormat('png')
    .toBuffer();
}

exports.handler = async function (event, context) {
  let matchText, prefix, dimension, width, height, filename;
  try {
    // key: prefix/100x100/filename.jpg
    const key = event.queryStringParameters.key;

    console.log(`Starting to resize image, bucket: ${BUCKET}`);
    console.log(`Key: ${key}`);

    const regex = /(.*?)\/((.*?)x(.*?))\/(.*)/;
    // extract required data for resizing
    [matchText, prefix, dimension, width, height, filename] = key.match(regex);
    const originalKey = `${prefix}/${filename}`;
    console.log(`Original key: ${originalKey}`);

    // Check if requested resolution is allowed
    if (0 != ALLOWED_RESOLUTIONS.size
      && !ALLOWED_RESOLUTIONS.has(dimension)) {
      return {
        statusCode: '403',
        headers: {},
        body: '',
      };
    }

    // read orginal image's data
    const data = await S3.getObject({ Bucket: BUCKET, Key: originalKey }).promise();
    console.log(`Finished getting object in S3`);

    // resize
    const buffer = await resize(data.Body, width, height);
    console.log(`Finished resizing image`);

    // upload resized image to S3
    await S3.putObject({
      Body: buffer,
      Bucket: BUCKET,
      ContentType: 'image/png',
      Key: key,
    }).promise();
    console.log(`Finished upload image, url: ${URL}/${key}`);

    // redirect to resized image
    return {
      statusCode: '301',
      headers: { 'location': `${URL}/${key}` },
      body: '',
    };
  } catch (error) {
    width = width || 100;
    height = height || 100;
    console.error(error);
    return {
      statusCode: '301',
      headers: { 'location': `http://via.placeholder.com/${width}x${height}?text=Not+found` },
      body: '',
    };
  }
}
