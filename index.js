const sqlPool = require('./utils/standalone.js');
const sqlTools = require('./utils/sql.js');
const ticketPrinter = require('./modules/ticket.printer.js');

sqlTools.sw(async () => {
  const connection = await sqlPool.connection();
  const query = 'SELECT * FROM venta_detalle';
  const rows = await connection.query(query);
  console.log(rows);
  await connection.end();
});
