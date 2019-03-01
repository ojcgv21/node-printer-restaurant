const sqlTools = require('../utils/sql.js');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const queryPedidos = ' SELECT ' +
                        ' v.vId AS id_venta,' +
                        ' v.vFecha AS fecha_pedido, ' +
                        ' m.mNumero AS numero_mesa, ' +
                        ' CONCAT(per.pNombres," ", per.pApellidos) AS mozo ' +
                    ' FROM pid p ' +
                        ' INNER JOIN venta v ' +
                        ' ON p.saleId = v.vId ' +
                        ' INNER JOIN mesa m ' +
                        ' ON v.vMesa = m.mId ' +
                        ' INNER JOIN persona per ' +
                        ' ON per.pId = v.vIdPersona ' +
                        ' INNER JOIN venta_detalle vd ' +
                        ' ON vd.vId = v.vId ' +
                    " WHERE p.status <> 'PRI'";

const printers = {
    cocina: process.env.PRINTER_COCINA,
    bar: process.env.PRINTER_BAR
};

exports.get = async (connection) => {
    const pedidos = await connection.query(queryPedidos);
    await sqlTools.pmap(pedidos, async (pedido) => {
        const query = ' SELECT ' +
                            ' vd.vd_Cantidad AS cantidad, ' +
                            ' pro.pNombre AS nombre' +
                        ' FROM venta_detalle vd ' +
                            ' INNER JOIN productos pro ' +
                            ' ON pro.idProducto = vd.vd_idProducto ' +
                        ' WHERE ' +
                            ' vd.vId = ? AND pro.pTicket = ? ';
        pedido.cocina = await connection.query(query, [pedido.id_venta, 1]);
        pedido.bar = await connection.query(query, [pedido.id_venta, 0]);
    });
    return pedidos;
};

const buildTicket = (pedido, type) => {
    let body = `     ${type}     \n` +
                '****************\n' +
                `Mesa: ${pedido.numero_mesa}\n` +
                `Personal: ${pedido.mozo}\n` +
                `Cant     Producto\n`;
    pedido[type].forEach(e => {
        body += `${e.cantidad}      ${e.nombre}\n`;
    });
    body += `${pedido.fecha_pedido}\n`;
    return {
        ticket: body,
        printer: printers[type]
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