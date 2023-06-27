const db = require('../db/index');
const bcrypt = require('bcryptjs');
const moment = require('moment');
//导入生成token字符串的包
const jwt = require('jsonwebtoken');
//导入全局配置文件，有密钥
const config = require('../config');

exports.addComment = (req, res) => {
    // //添加评论信息
    const commentInfo = {
        article_id: req.body.article_id,
        article_title: req.body.article_title,
        content: req.body.content,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
    }
    //查询用户名是否存在
    const sqlStr = 'select * from users where username=?'
    db.query(sqlStr, req.body.username, (err, results) => {
        if (err) return res.cc(err);
        if (results.length < 1) {
            return res.cc('用户名不存在，请重试！');
        }
        if (results[0].status === 1) {
            return res.cc('该用户已被禁用！');
        }
        //检测密码是否一致
        const compareResult = bcrypt.compareSync(req.body.password, results[0].password);
        if (!compareResult) return res.cc('密码错误，请重试!');
        // console.log(results[0].id);
        commentInfo.author_id = results[0].id;
        commentInfo.author_nickname = results[0].nickname;
        //向数据库中添加评论信息
        const sql = `insert into comments set ?`
        db.query(sql, commentInfo, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('评论发布失败！');
            res.cc('评论发布成功！', 0);
        })
    })
}

exports.deleteComment = (req, res) => {
    //删除评论
    const sql = `delete from comments where id=?`;
    db.query(sql, req.body.id, (err, results) => {
        if(err) return res.cc(err, 0);
        if(results.affectedRows !== 1) return res.cc('评论删除失败,请重试！',0);
        return res.cc('评论删除成功！');
    })
}

exports.updateComment = (req, res) => {
    //更新评论信息
    const commentInfo = {
        ...req.body,
        reply_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    }
    const sql = `update comments set ? where id=?`;
    db.query(sql, [commentInfo, req.body.id], (err, results) => {
        if(err) return res.cc(err);
        if(results.affectedRows !== 1) {
            return res.cc('操作失败!');
        }
        res.cc('操作成功', 0);
    })
}

exports.getAllComment = (req, res) => {
    //查询所有评论
    const sql = `select * from comments `
    db.query(sql, req.body.id, (err, results) => {
        if(err) return res.cc(err);
        if(results.length < 1) return res.cc('评论为空');
        res.send({
            status: 0,
            message: '获取评论成功!',
            data: results,
        })
    })
}

exports.getComment = (req, res) => {
    //查询指定文章所有评论
    // console.log(req.param("article_id"));
    const sql = `select * from comments where article_id=?`
    db.query(sql, req.param("article_id"), (err, results) => {
        if(err) return res.cc(err);
        if(results.length < 1) return res.cc('评论为空');
        res.send({
            status: 0,
            message: '获取评论成功!',
            data: results,
        })
    })
}