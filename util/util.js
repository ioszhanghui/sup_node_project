/*判断传过来的数据是不是合法的json*/
function checkIsJson (result) {
	if(!result){
		//空的
		return false;
	}
	if (Object.keys(result).length==0) {
		//空的json数据
		return false;
	}
	return true;
}
/*判断字符串是不是数字*/
function checkNumberValidate (val) {
	var reg = /^[0-9]+.?[0-9]*/;
	if (reg.test(val)) {
		return true;
	}
	return false;
}

/*判断字符串是不是为空*/
function  isNullString(str) {
	console.log(typeof str+"参数值");
	if(!(typeof str =="string")||str == undefined||!str||str =="undefined"||str=="null"||str=="<null>"){
		return false;
	}
	str = str.replace(/\s+/g,"");
	if(str.length==0){
		//空字符串
		return false;
	}
	return true;
}
/*拼接已经存在的ID*/
function appendID (list) {
	var str = "";
		for(var i=0;i<list.length;i++){
			str = str+list[i].discount_id;
			if (i!=list.length-1) {
				str = str+',';
			}
		}
	return str;
}
/*判断是否过期*/
function isTimeOut (date) {
	if(!date){
		return 0;
	}
	var currentDate = new Date();
	var lastDate = new Date(Date.parse(date.replace(/-/g, "/")));
	console.log(lastDate+"转成之后的日期");
	if (currentDate.getTime()-lastDate.getTime()>0) {
		return 1;
	}
	return 0;
}
/*产生12位的优惠券码*/
function supCode(){
	var str = "";
	while (str.length!=12){
		str =str+ Math.ceil(Math.random()*10);
	}
	return str;
}
module.exports = {
	checkIsJson:checkIsJson,
	isNullString:isNullString,
	appendID:appendID,
	isTimeOut:isTimeOut,
	supCode:supCode,
	checkNumberValidate:checkNumberValidate
}
