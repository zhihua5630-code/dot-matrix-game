## 部署
* 服务器：47.98.216.122
	* 目录：/opt/dot_matrix_game 
* 域名 dot.51putong.com
	* cloudfare解析
* 视频文件：部署到阿里云的oss，bucket是dot-matrix下的videos，以提高访问速度
	* 域名： dot-matrix.oss-accelerate.aliyuncs.com
	* 例子：https://dot-matrix.oss-accelerate.aliyuncs.com/videos/c30RL.mp4
* 用户数据：在阿里云的oss，bucket是dot-matrix下的userdata
	* 是通过后端服务 https://xcx.51putong.com 做的中转。
		* cloudfare做的https中转
	* @todo，现在xcx和hunter_back上的代码有点乱。 

* oss登录
	* 链接：https://signin.aliyun.com/31335427.onaliyun.com/login.htm
	* 账户：陈志华 zhihua@31335427.onaliyun.com
		* 绑定了bucket是dot-matrix的读写权限
	* 密码：陈志华 掌握，因为绑定她的手机号和邮箱

* 网站后段：
	* https://xcx.51putong.com/upload-dot-csv
		* post方法
	* main。js里调用后端