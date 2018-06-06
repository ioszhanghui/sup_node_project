var express =require('express');
var mysql = require('mysql');
var querystring = require('querystring');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
 var util =require('./util/util.js');
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

/*获取活动列表*/
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
app.listen(8081,function () {
console.log("服务器启动成功");	
})

