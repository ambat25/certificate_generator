const fs = require('fs');
const PDFDocument = require('pdfkit');
const base64 = require('base64-stream');

class Certificate {
  constructor(paper = 'A4', certificatePath, options = { X, Y, width, height, font }) {
    this.size =paper;
    this.certificatePath= certificatePath;
    this.X = options.X || 0;
    this.Y = options.Y || 320;
    this.width = options.width || 841.89;
    this.height = options.height || 595.28;
    this.font = options.font || 'Times-Roman';
  }
  
  generateBase64(name) {
    return new Promise((resolve, reject) => {
      const newDoc = new PDFDocument({
        layout: 'landscape',
        size: this.size
      });

      newDoc.image(this.certificatePath, 0, 0, {
        width: this.width,
        height: this.height,
      });
      newDoc.fontSize(35);
      newDoc.font(this.font);
      newDoc.text(`${name.toUpperCase()}`,this.X, this.Y, {width: this.width,align:'center'});


      let finalString = ''; // contains the base64 string
      const stream = newDoc.pipe(new base64.Base64Encode());
      newDoc.end();
      stream.on('data', (chunk) => {
        finalString += chunk;
      });

      stream.on('end', () => {
        resolve(finalString);
      });

      stream.on('error', () => {
        reject('Error generating PDF');
      });
    })
  }


  generateBase64Bulk(names) {
    const bulk = names.map(name => this.generateBase64(name));
    return Promise.all(bulk);
  }

  generateAndSave(name,) {
    const newDoc = new PDFDocument({
      layout: 'landscape',
      size: this.size
    });

      newDoc.image(this.certificatePath, 0, 0, {
        width: this.width,
        height: this.height,
      });
      newDoc.fontSize(35);
      newDoc.font(this.font);
      newDoc.text(`${name.toUpperCase()}`,this.X, this.Y, {width: this.width,align:'center'});

      newDoc.pipe(fs.createWriteStream(`./certificates/${name}.pdf`));
      newDoc.end();
  }
}

module.exports = Certificate;
