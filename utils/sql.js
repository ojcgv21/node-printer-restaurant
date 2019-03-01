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

exports.pmap = (array = [], iterator, { concurrency = 1000 } = {}) => {
	const size = array instanceof Array ? array.length : _.size(array);
	return new Promise((resolve, reject) => {
		var runner = (function* () {
			var promises = [], p;
			//step 1: start a new promise every time runner.next is called
			for (var key in array) {
				promises.push(p = iterator(array[key], key));
				if (size >= concurrency) {
					p.catch(reject).then(() => runner.next()); //start the next promise when one resolves
				}
				yield; //execution waiting for a call to runner.next
			}
			//step 2: everything has been started, we just have to wait for the promises to be completed to return the results
			Promise.all(promises).then(resolve).catch(reject);
		})();
		//init: start the first promises
		var i = 0;
		while (i < concurrency && ! runner.next().done) {
			++i;
		}
	});
};


exports.sw = func => {
    func().then(() => {

    }).catch(err => console.log(err));
}