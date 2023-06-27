const express = require('express');
const router = express.Router();

//导入处理函数
const userHandler = require('../router_handler/user');

//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
//导入需要验证的规则对象
const {reg_login_schema} = require('../schema/user');

//注册新用户
router.post('/register', expressJoi(reg_login_schema), userHandler.register);

//登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login);

//获取所有用户信息
router.get('/getusers', userHandler.getAlluser);

//禁用用户
router.post('/forbid', userHandler.forbidUser);

module.exports = router;