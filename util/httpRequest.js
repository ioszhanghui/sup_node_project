var request = require('request');
var utils = require('./util.js');
function httpUtil(type,data) {
	request({
		url:data.url,
		method:type,
		json:true,
		 headers: {
        		"content-type": "application/json",
   		 },
		form:data.param
	},function (error,response,body) {
		if (!error&&response.statusCode==200) {
			data.success(response.body);
			console.log(JSON.stringify(body)+"响应的");
    		}else{
    			data.fail(error);
    		}
	})
}
/*GET请求*/
function getHttpUtil(dataRecall) {
	request(dataRecall.url,function (error, response, data) {
		if(!error&&response.statusCode==200){
			dataRecall.success(response.body);
			console.log(JSON.stringify(data)+"响应的");
		}else{
			dataRecall.fail(error);
		}
	});	
}
/*post请求*/
function postHttpUtil (data) {
	httpUtil("POST",data);
}
/*模块引出*/
module.exports ={
	getHttpUtil:getHttpUtil,
	postHttpUtil:postHttpUtil
}
