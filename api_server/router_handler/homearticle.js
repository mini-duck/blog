const db = require('../db/index');
const moment = require('moment');

// exports.changeArticle = (req, res) => {
//     const articleInfo = {
//         ...req.body,
//         date: moment().format('YYYY-MM-DD HH:mm:ss'),
//     }
//     //修改文章
//     const sql = `update articles set ? where id=?`;
//     db.query(sql, [articleInfo, req.body.id], (err, results) => {
//         if(err) return res.cc(err);
//         if(results.affectedRows !== 1) {return res.cc('文章修改失败!');}
//         res.cc('文章修改成功！', 0);
//     })
// }

//更新文章
exports.updateArticle = (req, res) => {
    const articleInfo = {
        ...req.body,
    }
    //更新文章
    // console.log(articleInfo);
    const sql = `update articles set ? where id=?`;
    db.query(sql, [articleInfo, req.body.id], (err, results) => {
        if(err) return res.cc(err);
        if(results.affectedRows !== 1) {return res.cc('文章更新失败!');}
        res.cc('文章信息更新成功！', 0);
    })
}

exports.getArticle = (req, res) => {
    //查询所有文章信息
    const sql = `select * from articles`;
    db.query(sql, (err, results) => {
        // console.log('进get了');
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
    //查询指定文章信息
    const sql = `select * from articles where id = ?`;
    db.query(sql, req.body.id, (err, results) => {
        
        if(err) return res.cc(err);
        if(results.length < 1) return res.cc('文章为空！');
        console.log(results);
        res.send({
            status: 0,
            message: '获取文章成功!',
            data: results,
        })
    })
}
