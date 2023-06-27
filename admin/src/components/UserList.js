import React, { useState, useEffect } from 'react';
import {Modal, Button, message, Table, Tag, Tooltip, Avatar } from 'antd';
import axios from 'axios'

const {confirm} = Modal;

function UserList() {
    const [userlist, setUserList] = useState(['']);

    //向客户端发送token请求头进行身份认证
    axios.interceptors.request.use((config) => {
        let token = window.localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
            return config;
        }
    }, function (error) {
        message.error(error);
        return Promise.reject(error);
    })

    //获取用户信息
    const getList = () => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:3001/api/getusers',
        }).then((res) => {
            if(res.data.status === 0) {
                return setUserList(res.data.data);
            }
            console.log(res.data)
            message.error(res.data.message);
        })
    }

    useEffect(() => {
        getList();
    }, [])

    const userOperation = (id, status) => {
        if(status === 0) {
            axios({
                method: 'post',
                url: 'http://127.0.0.1:3001/api/forbid',
                data: {id: id, status: 1},
            }).then((res) => {
                if(res.data.status === 0) {
                    getList();      //重新查询数据
                }else{
                    message.error('禁用失败');
                }
            })
        } else {
            axios({
                method: 'post',
                url: 'http://127.0.0.1:3001/api/forbid',
                data: {id: id, status: 0},
            }).then((res) => {
                if(res.data.status === 0) {
                    getList();      //重新查询数据
                }else{
                    message.error('取消禁用失败');
                }
            })
        }
       
    }

    const columns = [
        {
            title: '头像',
            dataIndex: 'avatar',
            key: '1',
            width: 100,
            render: (text) => (
                <Avatar size={40} src={text} />
            )
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: '2',
            width: 150,
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: '3',
            width: 150,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: '4',
            width: 100,
            render: (text) => {
                if(text === 0){
                    return (
                        <Tag color={'green'}>
                            状态正常
                        </Tag>
                    )
                }else {
                    return (
                        <Tag color={'volcano'}>
                            已被禁用
                        </Tag>
                    )
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: '5',
            width: 100,
            render: (text, record) => {
                if(text === 0){
                    return (
                        <Button onClick={() => {userOperation(record.id,record.status)}}>
                            禁用
                        </Button>
                    )
                }else {
                    return (
                        <Button onClick={() => {userOperation(record.id,record.status)}}>
                            取消禁用
                        </Button>
                    )
                }
            }
        },
    ];
    const data = [];
    for (let i = 0; i < userlist.length; i++) {
        data.push({
            key: i,
            id: userlist[i].id,
            avatar: userlist[i].avatar,
            username: userlist[i].username,
            nickname: userlist[i].nickname,
            status: userlist[i].status,
            operation: userlist[i].status,
        })
    }

    return <Table
        columns={columns}
        dataSource={data}
        scroll={{
            x: 930,
            y: 500,
        }} />;

}

export default UserList;