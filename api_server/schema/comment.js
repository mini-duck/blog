//导入定义验证规则的模块
const joi = require('joi');

//定义标题、简介、内容的验证规则
const reply = joi.string().allow('');
const content = joi.string().allow('');

exports.add_comment_schema = {
    body: {
        content,
        reply,
    },
}