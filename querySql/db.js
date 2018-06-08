var defaults = require('../config/default.js');
var mysql = require('mysql');
var pool = mysql.createPool(defaults.mysqlConfig);

/*执行查询 并回调*/
function querydb(sql_db,db_param,callBack) {
	pool.getConnection(function  (error,connection) {
		if (!error) {
			connection.query(sql_db,db_param,function  (error,result) {
				if (!error) {
					callBack(result);
				}
			})
		}
	})
}
module.exports = {
	querydb:querydb
};

