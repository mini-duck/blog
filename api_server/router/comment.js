const express = require('express');
const router = express.Router();
// const expressJoi = require('@escook/express-joi');
// const { add_comment_schema } = require('../schema/comment');expressJoi(add_comment_schema),expressJoi(add_comment_schema),

//导入评论处理函数模块
const comment_handler = require('../router_handler/comment');

router.post('/add',  comment_handler.addComment);
router.post('/delete', comment_handler.deleteComment);
router.post('/update',  comment_handler.updateComment);
router.get('/get',comment_handler.getAllComment);
router.get('/getbyid', comment_handler.getComment);

module.exports = router;