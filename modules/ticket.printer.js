const printer = require('printer');

String.prototype.toBytes = () => {
    const arr = [];
    for (let i = 0; i < this.length; i++) {
        arr.push(this[i].charCodeAt(0));
    }
    return arr;
}

const prepareForPrint = str => {
    const printData = str.toBytes().concat([0x01B, 0x64, 10, 0x1d, 0x56, 0x00]);
    return Buffer.from(printData, 'HEX');
};

exports.cutPaper = printerName => {
  if (process.env.DEBUG === 'TRUE') {
    return;
  }
  return new Promise((resolve, reject) => {
    printer.printDirect({
      data: prepareForPrint(''),
      type: 'RAW',
      printer: printerName,
      success: jobID => {
        resolve(console.log("ID: " + jobID));
      },
      error: err => {
        reject(console.log('printer module error: ' + err));
        throw err;
      }
    });
  });
};

exports.sendPrintAsync = (ticket) => {
  if (process.env.DEBUG === 'TRUE') {
    console.log(ticket);
    return;
  }
  return new Promise((resolve, reject) => {
    printer.printDirect({
      data: ticket.text,
      type: 'RAW',
      printer: ticket.printer,
      success: jobID => {
        resolve(console.log("ID: " + jobID));
      },
      error: err => {
        reject(console.log('printer module error: ' + err));
        throw err;
      }
    });
  });
};

exports.sleep = ms => {
  return new Promise(resolve => {
      setTimeout(resolve, ms);
  });
};
