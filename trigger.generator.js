const sqlPool = require('./utils/standalone.js');
const sqlTools = require('./utils/sql.js');

sqlTools.sw(async () => {
    const connection = await sqlPool.connection();
    const query =   " CREATE TRIGGER trg_printer " + 
                    " AFTER INSERT ON venta FOR EACH ROW " +
                    " BEGIN " +
                    " INSERT INTO pid (saleId, status) VALUES (new.vId, ??); " +
                    " END;";
    await connection.query(query, "WAIT");
    await connection.commit();
    await connection.end();
  });