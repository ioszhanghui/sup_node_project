var util = require('../util/util');

function dealBonusList(list){
	
	for (var i = 0; i < list.length; i++) {
		var obj =list[i];
		obj.isTimeOut = util.isTimeOut(obj.discount_outtime);
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
