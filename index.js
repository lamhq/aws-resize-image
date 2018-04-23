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

exports.handler = async function(event, context) {
  try {
    const key = event.queryStringParameters.key;
    const regex = /(.*?)\/((\d+)x(\d+))\/(.*)/;
    let [ text, prefix, dimension, width, height, filename ] = key.match(regex);
    const originalKey = `${prefix}/${filename}`;
    width = parseInt(width, 10);
    height = parseInt(height, 10);

    // Check if requested resolution is allowed
    if(0 != ALLOWED_RESOLUTIONS.size 
      && !ALLOWED_RESOLUTIONS.has(dimension) ) {
      return {
        statusCode: '403',
        headers: {},
        body: '',
      };
    }

    // read image's data
    const data = await S3.getObject({Bucket: BUCKET, Key: originalKey }).promise();

    // resize
    const buffer = await Sharp(data.Body)
      .resize(width, height)
      .toFormat('png')
      .toBuffer();

    // upload resized image to S3
    await S3.putObject({
      Body: buffer,
      Bucket: BUCKET,
      ContentType: 'image/png',
      Key: key,
    }).promise();

    // redirect to resized image
    return {
      statusCode: '301',
      headers: {'location': `${URL}/${key}`},
      body: '',
    };    
  } catch (error) {
    console.error(error);
    return {
      statusCode: '301',
      headers: {'location': `http://via.placeholder.com/100x100?text=Not+found`},
      body: '',
    };
  }
}
