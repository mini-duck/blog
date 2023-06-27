const express = require('express');
const router = express.Router();
const expressJoi = require('@escook/express-joi');
const { add_article_schema } = require('../schema/article');

//导入文章的路由处理函数模块,
const homearticle_handler = require('../router_handler/homearticle')

// router.post('/change', homearticle_handler.changeArticle);
router.post('/update', homearticle_handler.updateArticle);
router.get('/get', homearticle_handler.getArticle);
router.get('/getbyid', homearticle_handler.getArticleById);

module.exports = router;