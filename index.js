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
    await ticketPrinter.sleep(500);
    await ticketPrinter.cutPaper(ticket.printer);
    await ticketPrinter.sleep(500);
    let arr = new Array(ticket.ids_venta_detalle.length).fill('?').join(',');
    const updateQueryVentaDetalle = `UPDATE venta_detalle SET detalle_imp = ? WHERE vdId in (${arr}) AND detalle_imp = ? `;
    await connection.query(updateQueryVentaDetalle, [1, ...ticket.ids_venta_detalle, 0]);
    await connection.commit();
  }, { concurrency: 1 });
  
  await connection.end();
});
