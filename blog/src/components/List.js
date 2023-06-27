import 'antd/dist/antd.min.css';
import { Row, Col, List } from 'antd';
import { ClockCircleOutlined, FireOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import Header from './Header';
import { useEffect, useState } from 'react';
import Blogger from './Blogger';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import PubSub from 'pubsub-js';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import '../styles/home/list.css'

function MyList() {
    const [mylist, setMylist] = useState(['']);
    const [allview, setAllView] = useState(0);
    const [allgood, setAllGood] = useState(0);
    const [allcomment, setAllComment] = useState(0);

    const getList = () => {
        console.log('执行')
        axios({
            method: 'get',
            url: 'http://127.0.0.1:3001/home/article/get',
        }).then(
            res => {
                let temallview = 0; let temallgood = 0; let temallcomment = 0;
                for (let i = 0; i < res.data.data.length; i++) {
                    temallview += res.data.data[i].view_count;
                    temallgood += res.data.data[i].good_count;
                    temallcomment += res.data.data[i].comment_count;
                }
                setAllView(temallview);
                setAllGood(temallgood);
                setAllComment(temallcomment);
                setMylist(res.data.data);
                console.log(res.data.data);
            }
        );
    }

    useEffect(() => {
        console.log('渲染');
        getList();
    }, [])

    //使用PubSub 兄弟组件传值
    const pubsub = (listid) => {
        PubSub.publish("getId", listid);
        for (let i in mylist) {
            if (mylist[i].id === listid) {
                mylist[i].view_count++;
                axios({
                    method: 'post',
                    url: 'http://127.0.0.1:3001/home/article/update',
                    data: { view_count: mylist[i].view_count++, id: listid }
                })
                break;
            }

        }
    }

    return (
        <div >
            <Header />
            <Row className='comm-main' type="flex" justify="center">
                <Col className="comm-left" xs={0} sm={5} md={7} lg={5} xl={4}>
                    <Blogger />
                    <div className='info'>
                        <div className='home-box'>
                            <div className='home-infoname'>总浏览量</div>
                            <div className='count-data'><FireOutlined /> {allview}</div>
                        </div>
                        <div className='home-box'>
                            <div className='home-infoname'>总点赞量</div>
                            <div className='count-data'><HeartOutlined /> {allgood}</div>
                        </div>
                        <div className='home-box'>
                            <div className='home-infoname'>总评论量</div>
                            <div className='count-data'><MessageOutlined /> {allcomment}</div>
                        </div>
                    </div>

                </Col>

                <Col className="comm-right" xs={24} sm={24} md={16} lg={18} xl={14}>
                    {/* <button onClick={get()}>点击</button> */}
                    <List
                        header={<div>最新日志</div>}
                        itemLayout="vertical"
                        dataSource={mylist}
                        renderItem={item => (
                            <List.Item >
                                <div className="list-title">
                                    <Link
                                        className='link-title'
                                        to='/details'
                                        onClick={() => { pubsub(item.id); item.view_count++ }}>
                                        {item.title}
                                    </Link>
                                </div>
                                <div className="list-icon">
                                    <span> <ClockCircleOutlined />{item.date}</span>
                                    <span> <FireOutlined /> {item.view_count}次</span>
                                </div>
                                <div className="list-introduction">
                                    <div className='introduction'>简介</div>
                                    <div className='introduce-html'>
                                        <ReactMarkdown
                                            remarkPlugins={[gfm]}>
                                            {item.introduction}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                                <div className="list-data">
                                    <span> <HeartOutlined /> {item.good_count} </span>
                                    <span> <MessageOutlined /> {item.comment_count} </span>
                                </div>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    );
}


export default MyList;
