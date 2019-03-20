const sqlTools = require('../utils/sql.js');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const queryPedidos = ' SELECT DISTINCT ' +
                        ' v.vId AS id_venta, ' +
                        ' v.vFecha AS fecha_pedido, ' +
                        ' m.mNumero AS numero_mesa, ' +
                        ' CONCAT(per.pNombres," ", per.pApellidos) AS mozo, ' +
                        ' v.vObservacion AS observacion ' +
                    ' FROM venta_detalle vd ' +
                        ' INNER JOIN venta v ' +
                            ' ON v.vId = vd.vId ' +
                        ' INNER JOIN mesa m ' +
                            ' ON v.vMesa = m.mId ' +
                        ' INNER JOIN persona per ' +
                            ' ON per.pId = v.vIdPersona ' +
                    " WHERE vd.detalle_imp = ?";

const printers = {
    cocina: process.env.PRINTER_COCINA,
    bar: process.env.PRINTER_BAR
};

exports.get = async (connection) => {
    const pedidos = await connection.query(queryPedidos, 0);
    await sqlTools.pmap(pedidos, async (pedido) => {
        const query = ' SELECT ' +
                            ' vd.vd_Cantidad AS cantidad, ' +
                            ' pro.pNombre AS nombre,' +
                            ' vd.vdId AS id_venta_detalle ' +
                        ' FROM venta_detalle vd ' +
                            ' INNER JOIN productos pro ' +
                            ' ON pro.idProducto = vd.vd_idProducto ' +
                        ' WHERE ' +
                            ' vd.vId = ? AND pro.pTicket = ? AND vd.detalle_imp = ?';
        pedido.cocina = await connection.query(query, [pedido.id_venta, 1, 0]);
        pedido.bar = await connection.query(query, [pedido.id_venta, 0, 0]);
    });
    return pedidos;
};

const buildTicket = (pedido, type) => {
    const ids_venta_detalle = [];
    let body = `     ${type}     \n` +
                '****************\n' +
                `Mesa: ${pedido.numero_mesa}\n` +
                `Personal: ${pedido.mozo}\n` +
                `Cant     Producto\n`;
    pedido[type].forEach(e => {
        body += `${e.cantidad}      ${e.nombre}\n`;
        ids_venta_detalle.push(e.id_venta_detalle);
    });
    body += `${pedido.fecha_pedido}\n`;
    body += `Observaciones: \n`;
    body += `${pedido.observacion}\n`;
    return {
        text: body,
        printer: printers[type],
        ids_venta_detalle: ids_venta_detalle
    };
};

exports.buildTickets = pedidos => {
    const tickets = [];
    pedidos.forEach(pedido => {
        if (pedido.cocina.length > 0) {
            tickets.push(buildTicket(pedido, 'cocina'));
        }
        if (pedido.bar.length > 0) {
            tickets.push(buildTicket(pedido, 'bar'));
        }
    });
    return tickets;
};