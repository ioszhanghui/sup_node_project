//登录
var loginSql ="SELECT COUNT(*) amount FROM user_info_table u where u.open_id=?"//登录用户查询
var loginSaveSql = 'insert into user_info_table(open_id) values(?)';//保存登录的用户id
//优惠券列表
var discount_listSql ="SELECT user_discount_relation.open_id,user_discount_relation.discount_id,user_discount_relation.is_get,user_discount_relation.is_use,sup_discount_coupon.discount_amount,sup_discount_coupon.discount_title,sup_discount_coupon.discount_reduce_amount,sup_discount_coupon.discount_outtime,sup_discount_coupon.discount_create_time FROM user_discount_relation RIGHT JOIN sup_discount_coupon ON user_discount_relation.discount_id = sup_discount_coupon.id WHERE user_discount_relation.open_id=?ORDER BY sup_discount_coupon.discount_create_time DESC";//查询已经领取的优惠券
var unHaveSql = "SELECT DISTINCT u.open_id,rel.is_get,rel.is_use,dis.discount_amount,dis.discount_title,dis.discount_reduce_amount,dis.discount_outtime,dis.id AS discount_id FROM user_info_table u ,user_discount_relation rel,sup_discount_coupon dis WHERE dis.id NOT in (?)";
//领取优惠券
var getDiscountSql = "INSERT INTO user_discount_relation(open_id,discount_id,is_get,is_use,discount_code) VALUES(?,?,?,?,?)";//领取优惠券
//查询详情的SQL语句
var detailSql = 'SELECT u.id,u.is_get,u.is_use,u.discount_id,u.discount_code,r.discount_amount,r.discount_title,r.discount_reduce_amount,r.discount_outtime FROM user_discount_relation u INNER JOIN sup_discount_coupon r ON u.discount_id =r.id WHERE u.discount_id=?';


module.exports={
	loginSql:loginSql,
	loginSaveSql:loginSaveSql,
	discount_listSql:discount_listSql,
	unHaveSql:unHaveSql,
	getDiscountSql:getDiscountSql,
	detailSql:detailSql
}
