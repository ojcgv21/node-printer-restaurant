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
    return new Buffer(printData);
};

exports.sendPrint = (str, printerName) => {
  printer.printDirect({
    data: prepareForPrint(str),
    type: 'RAW',
    printer: printerName,
    success: function (jobID) {
      console.log("ID: " + jobID);
    },
    error: function (err) {
      console.log('printer module error: '+ err);
      throw err;
    }
  });
}

