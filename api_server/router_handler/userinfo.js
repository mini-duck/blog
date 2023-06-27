const db = require('../db/index');
//导入处理密码模块
const bcrypt = require('bcryptjs');


exports.getInfo = (req, res) => {
    //查询用户信息
    const sql = `select id, username, nickname from users where id=?`;
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取用户信息失败！');
        res.send({
            status: 0,
            message: '获取用户基本信息成功!',
            data: results[0]
        })
    })

}

exports.updateInfo = (req, res) => {
    //更新用户信息
    const sql = `update users set ? where id=?`
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！');
        return res.cc('修改用户基本信息成功!', 0);
    })
}

exports.updatePassword = (req, res) => {
    const sql = `select * from users where id=?`
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('用户不存在');
        //compareSync() 验证旧密码是否正确，函数返回值为布尔值，true表示密码正确，false表示密码错误
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResult) return res.cc('原密码错误!');
        const mysql = `update users set password=? where id=?`;
        //对新密码进行加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        db.query(mysql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('更新密码失败!');
            res.cc('更新密码成功!', 0);
        })
    })
}

exports.updateAvatar = (req, res) => {
    //更新头像
    const sql = 'update users set avatar=? where id=?';
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('更新头像失败');

        //更新头像成功
        return res.cc('更新头像成功!', 0);
    })
}