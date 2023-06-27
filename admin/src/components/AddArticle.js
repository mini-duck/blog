import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button, message } from 'antd';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import axios from 'axios';
import PubSub from 'pubsub-js';
// import {getUrlParams} from '../util'
import '../styles/AddArticle.css';

const { TextArea } = Input

function AddArticle(props) {
    // console.log(props);
    const [articleId, setArticleId] = useState(0);      //新增不为零,修改为0
    const [articleTitle, setArticleTitle] = useState('');   //文章标题
    const [articleContent, setArticleContent] = useState('');   //文章内容
    const [introductionmd, setIntroductionmd] = useState('');   //文章简介markdown内容

    

    //文章简介设置
    const changeIntroduction = (e) => {
        setIntroductionmd(e.target.value);
    }

    //文章内容设置
    const changeContent = (e) => {
        setArticleContent(e.target.value);
    }

    //发布和保存文章方法
    const saveArticle = () => {
        if (!articleTitle) {
            message.error('文章标题不能为空！');
            return false;
        } else if (!introductionmd) {
            message.error('文章简介不能为空！');
            return false;
        } else if (!articleContent) {
            message.error('文章内容不能为空！');
            return false;
        }

        let dataProps = {
            title: articleTitle,
            introduction: introductionmd,
            content: articleContent,
            author_id: 11,
        }
        if (articleId === 0) {
            console.log('articleId=:' + articleId);
            // dataProps.view_count = Math.ceil(Math.random()*100 + 1000);
            axios({
                method: 'post',
                url: 'http://127.0.0.1:3001/my/article/add',
                data: dataProps,
            }).then((res) => {
                setArticleId(res.data.data);
                if (res.data.status === 0) {
                    message.success('文章保存成功!');
                } else {
                    message.error('文章保存失败！');
                }
            })
        } else {
            dataProps.id = articleId;
            axios({
                method: 'post',
                url: 'http://127.0.0.1:3001/my/article/change',
                data: dataProps
            }).then((res) => {console.log(res.data);
                if (res.data.status === 0) {
                    
                    message.success('文章保存成功！');
                } else {
                    message.error('保存失败！');
                }
            })
        }
    }

    //修改文章方法
    const getArticleById = (id) => {
        console.log('进了函数')
        axios({
            method: 'get',
            url: 'http://127.0.0.1:3001/my/article/getbyid',
            params: { id: id }
        }).then((res) => {
                console.log(res.data.data[0]);
                setArticleTitle(res.data.data[0].title);
                setIntroductionmd(res.data.data[0].introduction);
                setArticleContent(res.data.data[0].content);
            })
    }
    useEffect(() => {
        // //获取文章ID
        // console.log(props);
        // let tmpId = props.match.params.id;
        // const getPageQuery = () => parse(window.location.href.split('?')[1]);
        // console.log(getPageQuery);
        // if(tmpId) {
        //     setArticleId(tmpId);
        //     getArticleById(tmpId);
        // }
        PubSub.subscribe("getId",(msg, data) => {
            console.log('进了Pub' + data);
            if(data) {
                console.log('传了data');
                setArticleId(data);
                return getArticleById(data);
            }
        })
    })

    return (
        <div>
            <Row gutter={5}>
                <Col span={23}>
                    <Row>
                        <Col span={20} className='input-title'>
                            <span><Input placeholder="博文标题" size="large" value={articleTitle}
                                onChange={(e) => {
                                    setArticleTitle(e.target.value)
                                }} /></span>
                        </Col>
                        <Col>
                            <Button type="primary" size="large" onClick={saveArticle}>发布文章</Button>
                        </Col>
                    </Row>

                    <Row gutter={10}>
                        <Col span={12}>
                            <TextArea
                                rows={4}
                                placeholder="文章简介"
                                value={introductionmd}
                                onChange={changeIntroduction}
                                onPressEnter={changeIntroduction}
                            />
                        </Col>
                        <Col span={12}>
                            <div className='introduce-html'>
                                <ReactMarkdown remarkPlugins={[gfm]}>{introductionmd}</ReactMarkdown>
                            </div>
                        </Col>
                        <Col span={12}>
                            <TextArea
                                className='markdown-content'
                                rows={35}
                                placeholder="文章内容"
                                value={articleContent}
                                onChange={changeContent}
                                onPressEnter={changeContent}
                            />
                        </Col>
                        <Col span={12}>
                            <div className='show-html'>
                                <ReactMarkdown remarkPlugins={[gfm]}>{articleContent}</ReactMarkdown>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default AddArticle