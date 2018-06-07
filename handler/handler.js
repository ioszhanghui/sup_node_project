var util = require('../util/util');

function dealBonusList(list){
	
	for (var i = 0; i < list.length; i++) {
		var obj =list[i];
		obj.isTimeOut = util.isTimeOut(obj.discount_outtime);
	}
	return list;
}

module.exports = {
	dealBonusList:dealBonusList
}
