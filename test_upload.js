const { uploadMedia } = require('./.next/server/app/create/page.js') || {};
console.log('Cannot directly import from next build easily. Using fetch directly.');
const formData = new FormData();
formData.append('file', new Blob(['test']), 'test.txt');
formData.append('upload_preset', 'zl976ryd');
fetch('https://api.cloudinary.com/v1_1/lka6g8ku/image/upload', {
  method: 'POST',
  body: formData
}).then(r => r.json()).then(console.log).catch(console.error);
