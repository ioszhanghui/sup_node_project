/*全局的配置*/
/*数据库的链接配置*/
var mysqlConfig ={
	"host":"121.43.171.57",
	"user":"appxhb",
	"password":"120120",
	"database":"appxhb",
	"port":"3306",
	"connectionLimit":"20",//连接池可创建的最大链接数
	"waitForConnections":true,
	"queueLimit":"0"//最大连接请求队列限制，设置为0表示不限制，默认：0
}

module.exports={
	mysqlConfig:mysqlConfig
}
