import 'antd/dist/antd.min.css'
import { Row, Col, List, Avatar } from 'antd'
import { CommentOutlined, LikeOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import PubSub from 'pubsub-js'
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import axios from 'axios'
import '../styles/components/Comment.css'

function Comment() {
    const [comlist, setComList] = useState([''])
    const [comlistlength, setComlistLength] = useState(0)

    //接收兄弟组件List传过来的id
    const getListId = () => {
        return new Promise((resolve) => {
            PubSub.subscribe("getId", (msg, data) => {
                resolve(data);
            })
        })
    }

    const getCommentById = (listid) => {
        return new Promise((resolve) => {
            axios({
                method: 'get',
                url: 'http://127.0.0.1:3001/my/comment/getbyid',
                params: { article_id: listid },
            }).then((res) => {
                setComList(res.data.data);
                if (res.data.data) {
                    setComlistLength(res.data.data.length);
                    axios({
                        method: 'post',
                        url: 'http://127.0.0.1:3001/home/article/update',
                        data: {
                            comment_count: res.data.data.length,
                            id: listid,
                        }
                    })
                }
                resolve(comlist);
            })
        })
    }

    useEffect(() => {
        getListId().then((data) => {
            return getCommentById(data);
        })
    }, [])
    return (
        <div >
            <div className='comment_head'>共{comlistlength}条评论</div>
            <Row className='commen-box'>
                <Col className="comm-right" >
                    <List
                        itemLayout="vertical"
                        dataSource={comlist}
                        renderItem={item => (
                            <List.Item >
                                <div className="list-useinfo">
                                    <Avatar size={32} />
                                    <span className='nickname'>{item.author_nickname}</span>
                                    <span className='date'> <span className='pinglunyu'>评论于: </span>{item.date}</span>
                                    <span className='reply'><CommentOutlined /><a className='reply_click'>回复</a></span>
                                    <span className='good'><LikeOutlined />{item.good_count}</span>
                                    <div className='list-content-html'>
                                        <ReactMarkdown remarkPlugins={[gfm]}>{item.content}</ReactMarkdown>
                                    </div>
                                    {/* <div className="list-content">{item.content}</div> */}
                                </div>
                                {/* 判断回复是否为空，不为空则渲染回复框，为空则不渲染 */}
                                {item.reply ?
                                    <div className='replyinfo-box'>
                                        <Avatar size={32} />
                                        <span className='nickname'>红心柚</span>
                                        <span className='date'> <span className='pinglunyu'>回复于: </span>{item.reply_date}</span>
                                        <div className='list-content-html'>
                                            <ReactMarkdown remarkPlugins={[gfm]}>{item.reply}</ReactMarkdown>
                                        </div>
                                        {/* <div className="list-content">{item.reply}</div> */}
                                    </div>
                                    : ''
                                }
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Comment;
