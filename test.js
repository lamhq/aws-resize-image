// const url = 'http://lamhq.s3-website-ap-southeast-1.amazonaws.com/100x100/handel/test-upload.jpg';
// let [ text, dimension, width, height, originalKey ] = url.match(/((\d+)x(\d+))\/(.*)/);
// console.log(text, dimension, width, height, originalKey);

const key = 'handel/100x100/test-upload.jpg';
const regex = /(.*?)\/((\d+)x(\d+))\/(.*)/;
// const regex = new RegExp(`(.*?)\\/((\\d+)x(\\d+))\\/(.*)`);
const [ text, prefix, dimension, width, height, filename ] = key.match(regex);
console.log(regex.test(key), prefix, filename, width, height)
// console.log(key.match(regex))