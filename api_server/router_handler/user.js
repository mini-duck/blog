const db = require('../db/index');
const bcrypt = require('bcryptjs');
//导入生成token字符串的包
const jwt = require('jsonwebtoken');
//导入全局配置文件，有密钥
const config = require('../config');

exports.register = (req, res) => {
    //获取客户端提交的到服务器的用户信息
    const userinfo = req.body;

    //定义SQL语句，查询用户名是否被占用
    const sqlStr = 'select * from users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) return res.cc(err);

        if (results.length > 0) {
            return res.cc('用户名已被占用，请更换其他用户名!');
        }

        //对用户的密码进行bcrype加密，返回加密后的密码字符串,bcrypt.hashSync(明文密码, 随机盐的 长度) 方法
        userinfo.password = bcrypt.hashSync(userinfo.password, 12);

        //插入新用户
        const sql = 'insert into users set ?';
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败, 请稍后再试！');
            }
            res.cc('注册成功！', 0);
        })
    })
}

exports.login = (req, res) => {
    const userinfo = req.body;  //获取客户端提交到服务器的用户信息
    //定义SQL语句，查询用户名是否被占用
    const sqlStr = 'select * from users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1 || results[0].status === 1) return res.cc('该用户名不存在或已被禁用，请重试或重新注册！');
        // if (results[0].username !== userinfo.username) return res.cc('登录失败！')
        // bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('密码错误，请重试!');
        // res.cc('登录成功！', 0);
        // const user = {...results[0]};
        // console.log(user);
        //生成token字符串加密
        const user = { ...results[0], password: '', user_pic: '' };
        //对用户信息进行加密生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        //调用res.send() 将Token 响应给客户端
        res.send({
            status: 0,
            message: '登陆成功',
            //为方便客户端使用Token,在服务器端直接拼接前缀
            token: 'Bearer ' + tokenStr,
        })
    })
}

//获取全部用户信息
exports.getAlluser = (req, res) => {
    const sql = 'select * from users'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            data: results
        })
    })
}

//用户操作
exports.forbidUser = (req, res) => {
    const sql = 'update users set status=? where id=?';
    db.query(sql, [req.body.status, req.body.id], (err, results) => {
        if(err) return res.cc(err);
        if(results.affectedRows !== 1) {
            return res.cc('用户禁用失败，请稍后重试！');
        }
        res.cc('用户禁用成功', 0);
    }) 
}