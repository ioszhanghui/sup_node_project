var express =require('express');
var mysql = require('mysql');
var querystring = require('querystring');
var app = express();

var bodyParser = require('body-parser');
app.use(body_parser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var pool = mysql.createPool({"host":"39.105.115.133","user":"root","password":"123456","database":"mysql","port":"3306"})
/*跨域问题*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/*获取活动列表*/
app.get('/discountList',function(req,res,next){
	console.log(req.body.cust_no);
})
app.listen(8081,function () {
console.log("服务器启动成功");	
})
