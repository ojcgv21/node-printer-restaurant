const sqlPool = require('./utils/standalone.js');
const sqlTools = require('./utils/sql.js');

sqlTools.sw(async () => {
    const connection = await sqlPool.connection();
    const query =   " CREATE TRIGGER trg_printer " + 
                    " AFTER INSERT ON venta_detalle FOR EACH ROW " +
                    " BEGIN " +
                    " INSERT INTO pid SET saleId = NEW.vdId, status = 'WAIT'; " +
                    " END;";
    await connection.query(query);
    await connection.commit();
    await connection.end();
  });