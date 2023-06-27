const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const router = express.Router();
const app = express();
app.use(cors());

//用createPool方法建立与MySQL数据库的连接关系
const db = mysql.createPool({
    host: '127.0.0.1',  //数据库的IP地址
    user: 'root',   //登陆数据库的账号
    password: '123456', //密码
    database: 'my_blog',    //数据库名称
    port: '3306'    //端口号
})

db.connect();

const sqlStr = 'select * from articles';
db.query(sqlStr, (err,results) => {
    if (err) return console.log(err.message);
    // router.get('/',funtion (req,res,next) {
    //     res.json('index', {
    //         title: 'express测试实例连接数据库',
    //         data: results
    //     })
    // })

})

//导入路由模块
// const router = require('../routes/home');
// //把路由模块注册到app上
// app.use('/api',router);

//启动服务器
app.listen(80, () => {
    console.log('express server running at http://127.0.0.1');
})