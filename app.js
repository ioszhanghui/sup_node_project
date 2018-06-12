var express =require('express');
var querystring = require('querystring');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
 var util =require('./util/util.js');
 var handler = require('./handler/handler');
 var defaults = require('./config/default');
 var querySql = require('./querySql/querySql');
 var sqldb = require('./querySql/db.js');
 var log4js = require('log4js');
 log4js.configure({
 	levels:{
 		'log_date' : 'INFO'
 	},
 	appenders:[{
 		type:'console',
 		category:'console'
 	},
 	{
 		type:'dateFile',//写入日志
 		filename:'./logs/',//日志文件
 		alwaysIncludePattern: true,
 		encoding:'utf-8',////default "utf-8"，文件的编码
 		category : 'log_date',
 		pattern: "yyyy-MM-dd.log"
 	}
 	],
 	replaceConsole:true
 })
 var logger = log4js.getLogger('log_date');
 app.use(log4js.connectLogger(logger, {level:'INFO',format:':date:method :url'}));


/*全局设置解析格式*/
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/*' }));
app.use(multer());

/*跨域问题*/
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
	if(!util.isNullString(result.open_id)||!util.checkNumberValidate(result.open_id)){
		res.send({"code":"300","message":"参数异常 open_id"});
		return;
	}
	/*链接数据库*/

	sqldb.querydb(querySql.loginSql,[result.open_id]).then(function (data) {
		/*成功的回调*/
		if(data[0].amount==0){
				sqldb.querydb(querySql.loginSaveSql,[result.open_id]).then(function (data) {
		
					res.send({"code":"200","message":"登录成功"});
					
				}).catch(function  (error) {
					/*失败的回调*/
					res.send({"code":"500","message":"服务器异常"});
				})
				return;
		}
		res.send({"code":"200","message":"登录成功"});
		
	}).catch(function(error){
		/*失败的回调*/
		res.send({"code":"500","message":"服务器异常"});
		logger.error("接口"+req.url+"参数"+JSON.stringify(req.body)+error.stack);
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
	if(!util.isNullString(result.open_id)||!util.checkNumberValidate(result.open_id)){
		res.send({"code":"300","message":"参数异常 open_id"});
		return;
	}
	
	/*链接数据库*/
	sqldb.querydb(querySql.discount_listSql,[result.open_id]).then(function  (data) {
		var exitResult = data;
		var sqlLeft = util.appendID(exitResult);
		var unHaveSql = "SELECT DISTINCT dis.discount_amount,dis.discount_title,dis.discount_reduce_amount,dis.discount_outtime,dis.id AS discount_id FROM user_info_table u ,user_discount_relation rel,sup_discount_coupon dis WHERE dis.id NOT in ("+sqlLeft+")";
		
		sqldb.querydb(unHaveSql).then(function (data) {
			exitResult = handler.dealBonusList(exitResult);
			data = handler.dealUnHaveBonusList(data,result.open_id);
			exitResult =exitResult.concat(data);
			res.send({"code":"200","message":"获取成功","data":exitResult});
	
		}).catch(function  (error) {
			res.send({"code":"300","message":"查询失败"});
			logger.error("接口"+req.url+"参数"+JSON.stringify(req.body)+error.stack);
		})
		
	}).catch(function  (error) {
			/*失败的回调*/
		res.send({"code":"300","message":"查询失败"});
		logger.error("接口"+req.url+"参数"+JSON.stringify(req.body)+error.stack);
	});
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
	sqldb.querydb(querySql.getDiscountSql,[param.open_id,param.discount_id,"1","0",util.supCode()]).then(function  (result) {
		res.send({"code":"200","message":"领取成功"});
		
	}).catch(function  (error) {
		res.send({"code":"300","message":"领取失败"});
		logger.error("接口"+req.url+"参数"+JSON.stringify(req.body)+error.stack);
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
	
	sqldb.querydb(querySql.detailSql,[param.discount_id]).then(function  (data) {
		res.send({"code":"200","message":"查询成功",data:data[0]})
	}).catch(function (error) {
		res.send({"code":"300","message":"查询失败"})
		logger.error("接口"+req.url+"参数"+JSON.stringify(req.body)+error.stack);
	})
});
app.listen(8081,function () {
console.log("服务器启动成功");	
})

process.on("uncaughtException",function (error){
	console.log(error+"异常信息");
	logger.info(error.stack);
})
