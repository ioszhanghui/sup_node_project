var express =require('express');
var mysql = require('mysql');
var querystring = require('querystring');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
 var util =require('./util/util.js');
 var handler = require('./handler/handler');
 var defaults = require('./config/default');
 var querySql = require('./querySql/querySql');
 var sqldb = require('./querySql/db.js');
 var domains = require('domain');
 var logger = require('pomelo-logger').getLogger('pomelo');
 
/*全局设置解析格式*/
app.use(bodyParser.json());
app.use(multer());
/*全局异常处理*/
app.use(function  (req,res,next) {
	var d = domains.create();
	  //监听domain的错误事件
	  d.on('error', function (err) {
	    logger.error(err);
	    res.json({'code':"500", messag: '服务器异常'});
	    d.dispose();
	  });
	  
	  d.add(req);
	  d.add(res);
	  d.run(next);
})

var pool = mysql.createPool(defaults.mysqlConfig)
/*跨域问题*/
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

/*用户登录*/
app.post('/login',function(req,res){

	var result = req.body;
	if(!util.checkIsJson(result)){
				//没有接收到参数
		res.send({"code":"300","message":"参数异常"});
		return;
	}
	if(!util.isNullString(result.open_id)){
		res.send({"code":"300","message":"参数异常 open_id"});
		return;
	}
	/*链接数据库*/
	sqldb.querydb(querySql.loginSql,[result.open_id],function (result) {
			if(result[0].amount==0){
				sqldb.querydb(querySql.loginSaveSql,[result.open_id],function  (result) {
					if (!error) {
						res.send({"code":"200","message":"登录成功"});
						
					}else{
						//数据插入异常
						res.send({"code":"300","message":"接口异常"});
					}
				})
				return;
		}
		/*用户已经*/
		res.send({"code":"200","message":"登录成功"});
	})
})
/*获取优惠券列表*/
app.post('/getBonusList',function  (req,res) {
	var result = req.body;
	console.log(JSON.stringify(req.body)+"请求的参数");
	if(!util.checkIsJson(result)){
	//没有接收到参数
		res.send({"code":"300","message":"参数异常"});
		return;
	}
	if(!util.isNullString(result.open_id)){
		res.send({"code":"300","message":"参数异常 open_id"});
		return;
	}
	
	sqldb.querydb(querySql.discount_listSql,[result.open_id],function (result) {
					var exitResult = result;
					var sqlLeft =util.appendID(exitResult);
					var unHaveSql = "SELECT DISTINCT u.open_id,rel.is_get,rel.is_use,dis.discount_amount,dis.discount_title,dis.discount_reduce_amount,dis.discount_outtime,dis.id AS discount_id FROM user_info_table u ,user_discount_relation rel,sup_discount_coupon dis WHERE dis.id NOT in ("+sqlLeft+")";
					sqldb.querydb(unHaveSql,function (result) {
						exitResult =exitResult.concat(result);
						exitResult = handler.dealBonusList(exitResult);
						res.send({"code":"200","message":"获取成功","data":exitResult});
					})
			});
	/*链接数据库*/
//	pool.getConnection(function (error,connection) {
//		if (error) {
//			res.send({"code":"300","message":"接口异常"});
//		}else{
//			
//			connection.query(querySql.discount_listSql,[result.open_id],function (error,data) {
//				if (error) {
//					res.send({"code":"300","message":"接口异常"});
//					throw error;
//				}else{
//					var exitResult = data;
//					var sqlLeft =util.appendID(exitResult);
//					var unHaveSql = "SELECT DISTINCT u.open_id,rel.is_get,rel.is_use,dis.discount_amount,dis.discount_title,dis.discount_reduce_amount,dis.discount_outtime,dis.id AS discount_id FROM user_info_table u ,user_discount_relation rel,sup_discount_coupon dis WHERE dis.id NOT in ("+sqlLeft+")";
//					connection.query(unHaveSql,function (error,data) {
//						if (error) {
//							res.send({"code":"300","message":"接口异常"});
//						}else{
//							exitResult =exitResult.concat(data);
//							exitResult = handler.dealBonusList(exitResult);
//							res.send({"code":"200","message":"获取成功","data":exitResult});
//						}
//					});
//				}
//			});
//		}
//	})
})
/*领取优惠券*/
app.post('/getCoupons',function  (req,res) {
	
	if (!util.checkIsJson(req.body)) {
		res.send({"code":"300","message":"参数异常"});
		return;
	}
	var param = req.body;
	if (!util.isNullString(param.open_id)) {
		res.send({"code":"300","message":"参数异常 open_id"});
		return;
	}
	if (!util.isNullString(param.discount_id)) {
		res.send({"code":"300","message":"参数异常 discount_id"});
		return;
	}
	/*链接数据库*/
	pool.getConnection(function  (error,connection) {
		if (error) {
			res.send({"code":"300","message":"接口异常"});
			throw error;
		}else{			
			connection.query(querySql.getDiscountSql,[param.open_id,param.discount_id,"1","0",util.supCode()],function (error,data) {
				if (error) {
					res.send({"code":"300","message":"领取失败"});
					throw error;
				}else{
					res.send({"code":"200","message":"领取成功"});
				}
			})
		}
	})
})

/*领取优惠券详情*/
app.post('/supDetail',function  (req,res) {
	
	if (!util.checkIsJson(req.body)) {
		res.send({"code":"300","message":"参数异常"});
		return;
	}
	var param = req.body;
	if (!util.isNullString(param.open_id)) {
		res.send({"code":"300","message":"参数异常 open_id"});
		return;
	}
	if (!util.isNullString(param.discount_id)) {
		res.send({"code":"300","message":"参数异常 discount_id"});
		return;
	}
	pool.getConnection(function  (error,connection) {
		if (error) {
			res.send({"code":"300","message":"接口异常"});
			throw error;
		}else{
			connection.query(querySql.detailSql,[param.discount_id],function  (error,data) {
				if (error) {
					res.send({"code":"300","message":"查询失败"})
				}else{
					res.send({"code":"200","message":"查询成功",data:data[0]})
				}
			})
		}
	})
});
app.listen(8081,function () {
console.log("服务器启动成功");	
})

