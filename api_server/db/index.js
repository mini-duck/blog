const mysql = require('mysql');

// const db = mysql.createConnection({
//     host: '127.0.0.1',      //数据库地址
//     user: 'root',
//     password: '123456',
//     database: 'my_blog',
//     port: '3306'
// })

// //数据库建立连接
// db.connect();

const db = mysql.createPool({
    host: '127.0.0.1',      //数据库地址
    user: 'root',
    password: '123456',
    database: 'my_blog',
    // port: '3306'
})

module.exports = db;