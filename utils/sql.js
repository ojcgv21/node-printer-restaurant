const _ = require('underscore');
const mysql = require('promise-mysql');

exports.updateQuery = (table_name, id_name, obj, keys) => {
    const where = `${obj[id_name]} = ${id_name}`;
    const keyValueList = [];
    _.each(obj, (value, key) => {
        if (_.contains(keys, key)) {
            keyValueList.push(key);
            keyValueList.push(key);
        }
    });
    const t = `${new Array(keyValueList.length / 2).fill('?? = ?').join('')}`;
    const query = `UPDATE ?? SET ${t} WHERE ${where}`;
    return mysql.format(query, [table_name].concat(keyValueList));
};

exports.sw = func => {
    func().then(() => {

    }).catch(err => console.log(err));
}