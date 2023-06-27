const db = require('../db/index');
const moment = require('moment');

exports.addArticle = (req, res) => {
    // 要插入数据库的文章信息对象
    const articleInfo = {
        ...req.body,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        author_id: req.user.id
    }
    const sql = `insert into articles set ?`
    db.query(sql, articleInfo, (err, results) => {
        if(err) return res.cc(err);
        if(results.affectedRows !== 1) return res.cc('发布文章失败！ ');
        res.send({
            status: 0,
            message: '文章发布成功!',
            data: results.insertId,
        })
    })
}

exports.deleteArticle = (req, res) => {
    //删除文章
    const sql = `delete from articles where id=?`;
    db.query(sql, req.body.id, (err, results) => {
        if(err) return res.cc(err, 0);
        if(results.affectedRows !== 1) return res.cc('文章删除失败，请重试！', 0);
        return res.cc('文章删除成功！');
    })
}

exports.changeArticle = (req, res) => {
    const articleInfo = {
        ...req.body,
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
    }
    //修改文章
    // console.log(articleInfo);
    const sql = `update articles set ? where id=?`;
    db.query(sql, [articleInfo, req.body.id], (err, results) => {
        if(err) return res.cc(err);
        if(results.affectedRows !== 1) {return res.cc('文章修改失败!');}
        res.cc('文章修改成功！', 0);
    })
}

exports.getArticle = (req, res) => {
    //查询所有文章信息
    const sql = `select * from articles`;
    db.query(sql, (err, results) => {
        if(err) return res.cc(err);
        if(results.length < 1) return res.cc('文章为空！');
        res.send({
            status: 0,
            message: '获取文章成功!',
            data: results,
        })
    })
}


exports.getArticleById = (req, res) => {
    console.log(req.param("id"));
    //查询指定文章信息
    const sql = `select * from articles where id = ?`;
    db.query(sql, req.param("id"), (err, results) => {
        if(err) return res.cc(err);
        if(results.length < 1) return res.cc('文章为空！');
        // console.log(results);
        res.send({
            status: 0,
            message: '获取文章成功!',
            data: results,
        })
    })
}
