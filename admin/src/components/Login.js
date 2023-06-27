import React, { useState } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {message, Spin} from 'antd'
import axios from 'axios'
import history from '../lib/history'

import '../styles/Login.css'



function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkLogin = () => {
        setIsLoading(true);

        let dataProps = {
            'username': userName,
            'password': password
        }
        axios({
            method: 'post',
            url: 'http://127.0.0.1:3001/api/login',
            data: dataProps,
        }).then(res=>{
            if (res.data.status === 0){
                //本地存储登录后的token字符串
                // localStorage.setItem("token", JSON.stringify({data: res.data.token, time: new Date().getTime()}));
                localStorage.setItem("token",res.data.token);
                // console.log(token);
                history.push('/admin');
                message.success(res.data.message);
            }else{
                message.error(res.data.message);
            }
        })

        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    };

    return (
        <div className='login'>

            <Spin tip="Loading..." spinning={isLoading}>
                <div className='loginBox'>
                    <div className='header'>登录页面</div>
                    <div className='userNameBox'>
                        <div className='Box'>
                            <span><UserOutlined /></span>
                            <span><input type="text" name="username" placeholder='请输入用户名' className='input-item'
                                onChange={(e) => { setUserName(e.target.value) }} /></span>
                        </div>
                        <div className='Box'>
                            <span><LockOutlined /></span>
                            <span><input type="password" name="password" placeholder='请输入6~12的有效密码' className='input-item'
                                onChange={(e) => { setPassword(e.target.value) }} /></span>
                        </div>
                        <div className='btn' onClick={checkLogin}>登录</div>
                        <div className='reg'>还未曾注册？<a href='/register'>点我试试</a></div>
                    </div>
                </div>
            </Spin>

        </div>
    )
}

export default Login