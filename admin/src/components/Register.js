import React, { useState } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Spin} from 'antd'
import axios from 'axios'

import '../styles/Register.css'

function Register() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkRegister = () => {
        setIsLoading(true);

        var dataProps = {
            'username': userName,
            'password': password
        }
        console.log(dataProps);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:3001/api/register',
            data: dataProps,
        }).then(res=>{
            alert(res.data.message);
        })

        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    };

    return (
        <div className='register'>

            <Spin tip="Loading..." spinning={isLoading}>
                <div className='registerBox'>
                    <div className='header'>注册用户</div>
                    <div className='userNameBox'>
                        <div className='Box'>
                            <span><UserOutlined /></span>
                            <span><input type="text" name="username" placeholder='请输入用户名' className='input-item'
                                onChange={(e) => { setUserName(e.target.value) }} /></span>
                        </div>
                        <div className='Box'>
                            <span><LockOutlined /></span>
                            <span><input type="password" name="password" placeholder='请设置密码' className='input-item'
                                onChange={(e) => { setPassword(e.target.value) }} /></span>
                        </div>
                        <div className='btn' onClick={checkRegister}>注册</div>
                        <div className='log'><a href='/login'>返回登录</a></div>
                    </div>
                </div>
            </Spin>

        </div>
    )
}

export default Register