var util = require('../util/util');

function dealBonusList(list,type){
	
	for (var i = 0; i < list.length; i++) {
		var obj =list[i];
		obj.isTimeOut = util.isTimeOut(obj.discount_outtime);
		obj.discount_code =util.spaceCode(obj.discount_code);
		
		if (type =='is_get') {
			obj.discount_outtime = util.dateFormatter(obj.discount_outtime,"yyyy.MM.dd");
			obj.discount_create_time = util.dateFormatter(obj.discount_create_time,"yyyy.MM.dd");
		}
	}
	return list;
}

function dealUnHaveBonusList(list,open_id){
	
	for (var i = 0; i < list.length; i++) {
		var obj =list[i];
		obj.isTimeOut = util.isTimeOut(obj.discount_outtime);
		obj.open_id=open_id;
		obj.is_get ="0";
		obj.is_use="0";
	}
	return list;
}

module.exports = {
	dealBonusList:dealBonusList,
	dealUnHaveBonusList:dealUnHaveBonusList
}
