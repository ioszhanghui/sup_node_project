var defaults = require('../config/default.js');
var mysql = require('mysql');
var promiseError =require('promise');
var pool = mysql.createPool(defaults.mysqlConfig);

/*执行查询 并回调*/
function querydb(sql_db,db_param) {
	
	return new Promise(function(resolve,reject){
		
			pool.getConnection(function  (error,connection) {
				if (error) {
					reject(error);
					return;
				}
				connection.query(sql_db,db_param,function  (error,result) {
						connection.release();
						if (!error) {
							resolve(result);
							return;
						}
						reject(error);
					})
			})
	})
}
module.exports = {
	querydb:querydb
};

