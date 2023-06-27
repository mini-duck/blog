const express = require('express')
const app = express();
const cors = require('cors');
const joi = require('joi')
const bodyparser = require('body-parser');

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(bodyparser.json());

//在路由之前封装res.cc函数
app.use((req,res,next) => {
    //设置status默认值为1，表示失败
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,      //判断是字符串还是对象
        })
    }
    next();
})

const homearticleRouter = require('./router/homearticle');
app.use('/home/article',homearticleRouter);
const commentRouter = require('./router/comment');
app.use('/my/comment', commentRouter);

//在路由之前配置解析Token的中间件
const config = require('./config');
const expressJWT = require('express-jwt');

app.use(expressJWT({ secret: config.jwtSecretKey, algorithms:['HS256'] }).unless({ path: [/^\/api/]}))

const userRouter = require('./router/user')
const userinfoRouter = require('./router/userinfo');
const articleRouter = require('./router/article');


app.use('/api',userRouter);
app.use('/my',userinfoRouter); 
app.use('/my/article', articleRouter);

//定义错误级别中间件
app.use((err, req, res, next) => {
    //验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err);
    //身份认证失败后的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败!');
    //其他错误
    res.cc(err);
})

app.listen(3001,() => {
    console.log('express server running at http://127.0.0.1:3001');
})