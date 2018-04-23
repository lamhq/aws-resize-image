const url = 'http://lamhq.s3-website-ap-southeast-1.amazonaws.com/100x100/handel/test-upload.jpg';
// const match = url.match(/((\d+)x(\d+))\/(.*)/);
// let [ text, dimension, width, height, originalKey ] = url.match(regex);
// console.log(text, dimension, width, height, originalKey);
// let aaa = url.match(regex);
// const [ text, dimension, width, height, key ] = match;
const regex = new RegExp('((\d+)x(\d+))\/(.*)', 'i');
const match = url.match(regex);
console.log(match)