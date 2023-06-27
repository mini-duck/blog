const joi = require('joi');

// string() 值必须是字符串
//alphanum() 值只能是包含 a-z A-Z 0-9 的字符串
//min(length) 最小长度
//max(length) 最大长度
// required() 值是必须填项， 不能为undifined
// CanvasPattern(正则表达式)值必须符合正则表达式的规则


//用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
//密码验证
const password = joi
    .string()
    .pattern(/^[\S]{6,12}$/)        //6-12位密码
    .required();

//定义 id, nickname的验证规则
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
//定义avatar的验证规则dataUri()指的是这样格式的字符串数据：data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required();

//注册和登录表单的验证规则对象
exports.reg_login_schema = {
    body: {
        username,
        password,
    },
}

exports.update_userinfo_schema = { 
    body: { 
        id, 
        nickname, 
    }, 
} 

exports.update_password_schema = {
    body: {
        //使用password这个规则，验证req.body.oldpwd 的值
        oldPwd: password,
        //joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        //joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        //.concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
}

exports.update_avatar_schema = {
    body: {
        avatar,
    },
}