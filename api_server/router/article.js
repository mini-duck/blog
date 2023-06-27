const express = require('express');
const router = express.Router();
const expressJoi = require('@escook/express-joi');
const { add_article_schema } = require('../schema/article');

//导入文章的路由处理函数模块,expressJoi(add_article_schema), 
const article_handler = require('../router_handler/article')

router.post('/add', expressJoi(add_article_schema), article_handler.addArticle);
router.post('/delete', article_handler.deleteArticle);
router.post('/change', article_handler.changeArticle);
router.get('/get', article_handler.getArticle);
router.get('/getbyid', article_handler.getArticleById);

module.exports = router;