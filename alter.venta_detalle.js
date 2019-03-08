const sqlPool = require('./utils/standalone.js');
const sqlTools = require('./utils/sql.js');

sqlTools.sw(async () => {
    const connection = await sqlPool.connection();
    const query =   " alter table venta_detalle add column detalle_imp INT NOT NULL DEFAULT 0";
    await connection.query(query);
    await connection.commit();
    await connection.end();
  });