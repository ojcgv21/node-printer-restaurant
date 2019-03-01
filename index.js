var printer = require('printer');
var fs = require('fs');

//var info = fs.readFileSync('ticket.txt').toString();
var template = "N\nS4\nD15\nq400\nR\nB20,10,0,1,2,30,173,B,\"barcode\"\nP0\n";

function sendPrint() {
  printer.printDirect({
    data: template.replace(/barcode/, "123"),
    type: 'RAW',
    success: function (jobID) {
      console.log("ID: " + jobID);
    },
    error: function (err) {
      console.log('printer module error: '+err);
      throw err;
    }
  });
}

sendPrint();
