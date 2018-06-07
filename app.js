var express =require('express');
var mysql = require('mysql');
var querystring = require('querystring');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
 var util =require('./util/util.js');
 var handler = require('./handler/handler');
/*全局设置解析格式*/
app.use(bodyParser.json());
app.use(multer());

var pool = mysql.createPool({"host":"39.105.115.133","user":"root","password":"123456","database":"mysql","port":"3306"})
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
	console.log(JSON.stringify(req.body)+"接收到的参数");
	if(!util.checkIsJson(result)){
				//没有接收到参数
		res.send({"code":"300","message":"参数异常"});
		return;
	}
	console.log(result.open_id+"open_id");
	if(!util.isNullString(result.open_id)){
		res.send({"code":"300","message":"参数异常 open_id"});
		return;
	}
	/*链接数据库*/
	pool.getConnection(function (error,connection) {
		if (error) {
			res.send({"code":"300","message":"接口异常"});
		}else{
			connection.query("SELECT COUNT(*) amount FROM user_info_table",function (error,data) {
				console.log(JSON.stringify(data)+"个数");
				if(data[0].amount==0){
					connection.query('insert into user_info_table(open_id) values('+result.open_id+')',function (error,data) {
						if (!error) {
							res.send({"code":"200","message":"登录成功"});
						}else{
							//数据插入异常
							res.send({"code":"300","message":"接口异常"});
						}
					})
				}
			});
		}
	})
})
/*获取优惠券列表*/
app.post('/getBonusList',function  (req,res) {
		var result = req.body;
	console.log(JSON.stringify(req.body)+"接收到的参数");
	if(!util.checkIsJson(result)){
				//没有接收到参数
		res.send({"code":"300","message":"参数异常"});
		return;
	}
	console.log(result.open_id+"open_id");
	if(!util.isNullString(result.open_id)){
		res.send({"code":"300","message":"参数异常 open_id"});
		return;
	}
	/*链接数据库*/
	pool.getConnection(function (error,connection) {
		if (error) {
			res.send({"code":"300","message":"接口异常"});
		}else{
			
			var sqlStr ="SELECT user_discount_relation.open_id,user_discount_relation.discount_id,user_discount_relation.is_get,user_discount_relation.is_use,sup_discount_coupon.discount_amount,sup_discount_coupon.discount_title,sup_discount_coupon.discount_reduce_amount,sup_discount_coupon.discount_outtime,sup_discount_coupon.discount_create_time FROM user_discount_relation RIGHT JOIN sup_discount_coupon ON user_discount_relation.discount_id = sup_discount_coupon.id WHERE user_discount_relation.open_id="+result.open_id+" ORDER BY sup_discount_coupon.discount_create_time DESC";
			console.log(sqlStr+"查询语句");
			connection.query(sqlStr,function (error,data) {
				if (error) {
					res.send({"code":"300","message":"接口异常"});
				}else{
					var exitResult = data;
					var sqlLeft =util.appendID(exitResult);
					var unHaveSql = "SELECT DISTINCT u.open_id,rel.is_get,rel.is_use,dis.discount_amount,dis.discount_title,dis.discount_reduce_amount,dis.discount_outtime,dis.id AS discount_id FROM user_info_table u ,user_discount_relation rel,sup_discount_coupon dis WHERE dis.id NOT in ("+sqlLeft+")";
					connection.query(unHaveSql,function (error,data) {
						if (error) {
							res.send({"code":"300","message":"接口异常"});
						}else{
							exitResult =exitResult.concat(data);
							exitResult = handler.dealBonusList(exitResult);
							res.send({"code":"200","message":"获取成功","data":exitResult});
						}
					});
				}
			});
		}
	})
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
		}else{
			var sqlStr = "INSERT INTO user_discount_relation(open_id,discount_id,is_get,is_use,discount_code) VALUES("+param.open_id+","+param.discount_id+","+"1"+","+"0"+","+util.supCode()+")";
			console.log(sqlStr+"插入的语句");
			connection.query(sqlStr,function (error,data) {
				if (error) {
					res.send({"code":"300","message":"领取失败"});
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
		}else{
			var sqlStr = 'SELECT u.id,u.is_get,u.is_use,u.discount_id,u.discount_code,r.discount_amount,r.discount_title,r.discount_reduce_amount,r.discount_outtime FROM user_discount_relation u INNER JOIN sup_discount_coupon r ON u.discount_id =r.id WHERE u.discount_id='+param.discount_id;
			console.log(sqlStr+"查询语句");
			connection.query(sqlStr,function  (error,data) {
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

