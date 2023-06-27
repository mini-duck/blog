import 'antd/dist/antd.min.css'
import { Row, Col, Input, Divider, message } from 'antd'
import { ClockCircleOutlined, FireOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons'
import Header from './Header'
import { useState, useEffect } from 'react'
import Blogger from './Blogger'
import Comment from './Comment'
import ReactMarkdown from 'react-markdown'
import MarkNav from 'markdown-navbar'
import PubSub from 'pubsub-js'
import axios from 'axios'

import '../styles/home/body.css'
import '../styles/components/details.css'
import 'markdown-navbar/dist/navbar.css'

const { TextArea } = Input

function Details() {
    const [listid, setListId] = useState(PubSub.subscribe("getId", (msg, data) => { return data }));
    const [list, setList] = useState([]);
    const [comusername, setComUsername] = useState('');
    const [compassword, setComPassword] = useState('');
    const [comnickname, setComNickname] = useState('')
    const [comcontent, setComContent] = useState('');
    // const [comment_count, setCommentCount] = useState(0);
    const [islike, setLike] = useState(false);

    //接收list传过来的id
    const getListId = () => {
        return new Promise((resolve) => {
            PubSub.subscribe("getId", (msg, data) => {
                resolve(data);
            })
        })
    }

    //获取详情信息
    const getArticleById = (listid) => {
        // axios({
        //     method: 'get',
        //     url: 'http://127.0.0.1:3001/my/comment/getbyid',
        //     params: { article_id: listid },
        // }).then((res) => {
        //     if(res.data.data){
        //         // setCommentCount(res.data.data.length);
        //     }
        // })
        return new Promise((resolve) => {
            axios({
                method: 'get',
                url: 'http://127.0.0.1:3001/home/article/get',
            }).then((res) => {
                console.log("getAticleById里面的id " + listid);
                setListId(listid);
                for (let i in res.data.data) {
                    if (res.data.data[i].id === listid) {
                        setList(res.data.data[i]);
                        break;
                    }
                }
                resolve(list);
            })
        })

    }

    useEffect(() => {
        getListId().then((data) => {
            return getArticleById(data);
        })
    }, [])

    //点赞
    const clickLike = () => {
        setLike(!islike);
        if(islike === false) {
            list.good_count ++;
            axios({
                method: 'post',
                url: 'http://127.0.0.1:3001/home/article/update',
                data: {id: listid, good_count: list.good_count},
            })
        }else {
            list.good_count--;
            axios({
                method: 'post',
                url: 'http://127.0.0.1:3001/home/article/update',
                data: {id: listid, good_count: list.good_count},
            })
        }
    }

    //发布评论
    const submitComment = () => {
        if(!comcontent) {
            return message.error('评论不能为空！');
        }
        axios({
            method: 'post',
            url: 'http://127.0.0.1:3001/my/comment/add',
            data: {
                username: comusername,
                password: compassword,
                nickname: comnickname,
                content: comcontent,
                article_id: listid,
                article_title: list.title,
            }
        }).then((res) => {
            if (res.data.status === 0) {
                // setComContent(' ');
                axios({
                    method: 'post',
                    url: 'http://127.0.0.1:3001/home/article/update',
                    data: {id: listid, comment_count: ++list.comment_count},
                }).then((res) => {
                    if(res.data.status === 0) {
                        getArticleById(listid);
                        message.success('评论发布成功');
                    }
                })
            } else {
                message.error(res.data.message);
            }
        })
    }

    return (
        <div >
            <Header />
            <header>
                博客详情页
            </header>
            <Row className='comm-main' type="flex" justify="center">
                <Col className="comm-left" xs={0} sm={5} md={7} lg={5} xl={4}>
                    <Blogger />

                    <div className='details-nav comm-box'>
                        <div className='nav-title'>文章目录</div>
                        <MarkNav
                            className='article-nav'
                            source={list.content}
                            ordered={false} />
                    </div>
                </Col>

                <Col className="details-right" xs={24} sm={24} md={16} lg={18} xl={14}>
                    <div>
                        <div>
                            <div className='details-title'>
                                {list.title}
                            </div>

                            <div className="list-icon center">
                                <span> <ClockCircleOutlined /> {list.date}</span>
                                <span> <FireOutlined /> {list.view_count}人</span>
                            </div>


                            <div className="details-introduction">
                                <Divider>简介</Divider>
                                <div className='introduce-html'>
                                <ReactMarkdown>{list.introduction}</ReactMarkdown>
                                </div>
                            </div>


                            <div className="details-content">
                                <Divider>正文</Divider>
                                <div className='introduce-html'>
                                    <ReactMarkdown>{list.content}</ReactMarkdown>
                                </div>
                                
                            </div>

                            <div className="details-data">
                            {/* setLike(islike === true ? false : true) */}
                                <span onClick={() => {clickLike()}}>
                                    <span className='like'>{islike ? '❤' : <HeartOutlined />}</span>
                                    {list.good_count}
                                </span>
                                <span> <MessageOutlined /> {list.comment_count} </span>
                            </div>
                        </div>

                        <Divider />

                        <div className='input-info'>
                            <div className='input-box'>
                                <div className='input-name' placeholder='必填' >用户名</div>
                                <input className='inputkuang' onChange={(e) => { setComUsername(e.target.value) }} />
                            </div>
                            <div className='input-box'>
                                <div className='input-name' placeholder='必填' >密码</div>
                                <input className='inputkuang' type="password" onChange={(e) => { setComPassword(e.target.value) }} />
                            </div>
                            <div className='input-box'>
                                <div className='input-name' placeholder='选填' >昵称</div>
                                <input className='inputkuang' onChange={(e) => { setComNickname(e.target.value) }} />
                            </div>
                        </div>

                        <div>
                            <TextArea className='text-input' placeholder='说点什么叭~ 支持markdown格式！' onChange={(e) => { setComContent(e.target.value) }} /><span><button onClick={submitComment}>发送</button></span>
                        </div>
                        <Comment />
                    </div>

                </Col>

            </Row>
        </div>
    );
}

export default Details;
