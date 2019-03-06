const sqlPool = require('./utils/standalone.js');
const sqlTools = require('./utils/sql.js');
const pedidos = require('./modules/pedidos.js');
const ticketPrinter = require('./modules/ticket.printer.js');

sqlTools.sw(async () => {
  const connection = await sqlPool.connection();
  const ps = await pedidos.get(connection); 

  const tickets = pedidos.buildTickets(ps);

  await sqlTools.pmap(tickets, async (ticket) => {
    await ticketPrinter.sendPrintAsync(ticket);
    await ticketPrinter.sleep(2000);
    await ticketPrinter.cutPaper(ticket.printer);
    await ticketPrinter.sleep(2000);
    const updateQuery = 'UPDATE pid SET status = ? WHERE saleId = ?';
    await connection.query(updateQuery, ['PRI', ticket.id_venta]);
    await connection.commit();
  }, { concurrency: 1 });
  
  await connection.end();
});
