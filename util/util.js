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

/*判断字符串是不是为空*/
function  isNullString(str) {
	
	if(!(typeof str =="string")||str == undefined||!str){
		return false;
	}
	str = str.replace(/\s+/g,"");
	if(str.length==0){
		//空字符串
		return false;
	}
	return true;
}
module.exports = {
	checkIsJson:checkIsJson,
	isNullString:isNullString
}
