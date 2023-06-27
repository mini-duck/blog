import React, { useState, useEffect } from 'react'
import {Modal, Button, message, Input, Table, Tooltip } from 'antd'
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import axios from 'axios';

import '../styles/CommentList.css'

const { confirm } = Modal
const { TextArea } = Input

function CommentList() {
    const [comlist, setComList] = useState(['']);
    const [replyid, setReplyId] = useState('');
    const [repContent, setRepContent] = useState('');

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

    const getList = () => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:3001/my/comment/get',
        }).then((res) => {
            if (res.data.status === 0) {
                setComList(res.data.data)
            } else {
                message.error(res.data.message);
            }
        })
    }
    useEffect(() => {
        getList();
    }, [])

    //回复评论方法
    const repComment = () => {
        axios({
            method: 'post',
            url: 'http://127.0.0.1:3001/my/comment/update',
            data: {reply: repContent, id: replyid}
        }).then((res) => {
            if(res.data.status === 0) {
                setReplyId('');
                getList();     //重新查询数据库，获取评论列表
                message.success('回复成功');
            }else {
                message.error(res.data.message);
            }
        })
    }

    //删除评论方法
    const delComment = (id) => {
        confirm({
            title: '确定删除此评论吗?',
            content: '如果点击OK按钮, 评论将被永久删除！',
            onOk() {
                axios({
                    method: 'post',
                    url: 'http://127.0.0.1:3001/my/comment/delete',
                    data: { id: id },
                }).then((res) => {
                    if (res.data.status === 1) {
                        message.success('评论删除成功');
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
            dataIndex: 'article_title',
            key: '1',
            width: 150,
        },
        {
            title: '昵称',
            dataIndex: 'author_nickname',
            key: '2',
            width: 50,
        },
        {
            title: '评论内容',
            dataIndex: 'content',
            key: '3',
            width: 200,
            render: (text) => (
                <div className='comment-html'>
                    <ReactMarkdown remarkPlugins={[gfm]}>{text}</ReactMarkdown>
                </div>
            ),
        },
        {
            title: '评论日期',
            dataIndex: 'date',
            key: '4',
            width: 100,
        },
        {
            title: '获赞',
            dataIndex: 'good_count',
            key: '5',
            width: 100,
        },
        {
            title: '我的回复',
            dataIndex: 'reply',
            key: '6',
            width: 150,
            render: (text) => (
                <div className='comment-html'>
                    <ReactMarkdown remarkPlugins={[gfm]}>{text}</ReactMarkdown>
                </div>
            ),
        },
        {
            title: '操作',
            dataIndex: 'replybtn',
            key: '7',
            width: 60,
            render: (text, record) => (
                <Button onClick={() => { setReplyId(record.id)} }>{text}</Button>
            )
        },
        {
            title: '',
            dataIndex: 'delete',
            key: '8',
            width: 60,
            render: (text, record) => (
                <Button onClick={() => { delComment(record.id) }}>{text}</Button>
            )
        }
    ];
    const data = [];
    for (let i = 0; i < comlist.length; i++) {
        data.push({
            key: i,
            id: comlist[i].id,
            article_title: comlist[i].article_title,
            author_nickname: comlist[i].author_nickname,
            content: comlist[i].content,
            date: comlist[i].date,
            good_count: comlist[i].good_count,
            reply: comlist[i].reply,
            replybtn: '回复',
            delete: '删除',
        })
    }


    return (
        <div>
            {replyid?<div className='reply-box'><TextArea className='text-input' placeholder='说点什么叭~' onChange={(e) => { setRepContent(e.target.value) }} />
                <span><button className='reply-button' onClick={()=>{repComment()}}>发送</button></span>
                <span><button className='reply-button' onClick={()=>{setReplyId(!replyid);}}>取消</button></span>
                </div> 
                : '' }
            <Table
                columns={columns}
                dataSource={data}
                scroll={{
                    x: 930,
                    y: 500,
                }} />
            
        </div>

    )


}

export default CommentList