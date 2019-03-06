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
  }, { concurrency: 1 });
  

  await connection.end();
});
