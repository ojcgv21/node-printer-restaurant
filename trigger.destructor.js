const sqlPool = require('./utils/standalone.js');
const sqlTools = require('./utils/sql.js');

sqlTools.sw(async () => {
    const connection = await sqlPool.connection();
    const dropQuery = "DROP TRIGGER trg_printer; ";
    await connection.query(dropQuery);
    await connection.commit();
    await connection.end();
  });