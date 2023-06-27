import React, { useState, useEffect } from 'react';
import {  Modal, Button, message, Table} from 'antd';
import axios from 'axios';
import history from '../lib/history';
import PubSub from 'pubsub-js';

const { confirm } = Modal

function ArticleList(props) {
    const [list, setList] = useState(['']);

    axios.interceptors.request.use((config) => {
        let token = window.localStorage.getItem("token");
        // if(token) return null;
        // let tokens = JSON.parse(token);
        // console.log(token);
        // if (new Date().getTime() - tokens.time > 3600000) {
        //     window.localStorage.removeItem(token);
        //     alert('数据已过期，请重新登录');
        //     return null;
        // }
        if (token) {
            config.headers.Authorization = token;
            return config;
        }
    }, function (error) {
        return Promise.reject(error);
    })

    const getList = () => {

        axios({
            method: 'get',
            url: 'http://127.0.0.1:3001/my/article/get'
        }).then((res) => {
            if (res.data.status === 0) {
                setList(res.data.data)
            } else {
                message.error(res.data.message);
            }
        }
        )
    }
    useEffect(() => {
        getList();
    }, [])

    //修改文章方法
    const editArticle = (id) => {
        PubSub.publish("getId", id);
        return history.push('/admin/add' );
    }

    const deleteArticle = (id) => {
        confirm({
            title: '确定删除此文章吗?',
            content: '如果点击OK按钮, 文章将被永久删除！',
            onOk() {
                axios({
                    method: 'post',
                    url: 'http://127.0.0.1:3001/my/article/delete',
                    data: { id: id },
                }).then((res) => {
                    if (res.data.status === 1) {
                        message.success('文章删除成功');
                        getList()     //重新查询数据库，获取文章列表
                    } else {
                        message.error(res.data.message);
                    }
                })
            },
            onCancel() {
                message.success('已取消删除');
            }
        })
    }

    const columns = [
        {
            title: '文章标题',
            dataIndex: 'title',
            key: 'title',
            width: 300,
        },
        {
            title: '发布时间',
            dataIndex: 'date',
            key: 'date',
            width: 170,
        },
        {
            title: '浏览量',
            dataIndex: 'view_count',
            key: '1',
            width: 100,
        },
        {
            title: '获赞',
            dataIndex: 'good_count',
            key: '2',
            width: 100,
        },
        {
            title: '评论量',
            dataIndex: 'comment_count',
            key: '3',
            width: 100,
        },
        {
            title:'操作',
            dataIndex: 'edit',
            key: '5',
            width: 80,
            render: (text, record) => (
                <Button onClick={() => {editArticle(record.id)}}>{text}</Button>
            )
        },
        {title: '',
            dataIndex: 'delete',
            key: '4',
            width: 80,
            render: (text, record) => (
                <Button onClick={() => {deleteArticle(record.id)}}>{text}</Button>
            )
            
        }
    ];
    const data = [];
    for (let i = 0; i < list.length; i++) {
        data.push({
            key: i,
            id: list[i].id,
            title: list[i].title,
            date: list[i].date,
            view_count: list[i].view_count,
            good_count: list[i].good_count,
            comment_count: list[i].comment_count,
            delete: '删除',
            edit: '修改'
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

export default ArticleList