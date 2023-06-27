//导入定义验证规则的模块
const joi = require('joi');

//定义标题、简介、内容的验证规则
const title = joi.string().required();
const introduction = joi.string().required().allow('');
const content = joi.string().required().allow('');

exports.add_article_schema = {
    body: {
        title,
        introduction,
        content,
    },
}