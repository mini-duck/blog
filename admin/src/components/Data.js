import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Statistic, message } from 'antd';
import { EditOutlined, HeartOutlined, MessageOutlined, FireOutlined } from '@ant-design/icons';
import axios from 'axios';
//全局引入
import * as echarts from 'echarts';

import '../styles/Data.css'

function Data() {
    const [allarticle, setAllArticle] = useState(0);
    const [allview, setAllView] = useState(0);
    const [allgood, setAllGood] = useState(0);
    const [allcomment, setAllComment] = useState(0);
    const chartRef = useRef(null);

    const getdata = () => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:3001/home/article/get',
        }).then(
            res => {
                if (res.data.status === 0) {
                    let temallview = 0; let temallgood = 0; let temallcomment = 0;
                    for (let i = 0; i < res.data.data.length; i++) {
                        temallview += res.data.data[i].view_count;
                        temallgood += res.data.data[i].good_count;
                        temallcomment += res.data.data[i].comment_count;
                    }
                    setAllArticle(res.data.data.length);
                    setAllView(temallview);
                    setAllGood(temallgood);
                    setAllComment(temallcomment);
                    // console.log(res.data.data);
                } else {
                    message.error('获取数据失败!');
                }

            }
        );
    }

    useEffect(() => {
        getdata();

        let chartInstance = echarts.init(chartRef.current);
        const option = {
            legend: {
                data: [
                    "访问量",
                    "点赞量",
                    // "60岁全程接种量",
                    "评论量",
                    // "80岁全程接种量",
                    "新增粉丝数",
                ],
            },
            xAxis: {
                type: "category",
                data: ["文章1", "文章2", "文章3", "文章4", "文章5"],
            },
            yAxis: [
                { type: "value" },
                {
                    type: "value",
                    name: "%",
                    nameAxisName: {
                        color: "#ccc",
                        padding: [0, 0, 10, -30],
                    },
                    splitNumber: 5,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "dashed",
                            width: 1,
                            color: ["#ccc", "#ccc"],
                        },
                    },
                    axisLabel: {
                        show: true,
                        fontSize: 12,
                    },
                },
            ],
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
                textStyle: {
                    color: "#fff",
                    align: "left",
                    fontSize: 14,
                },
                backgroundColor: "rgba(0,0,0,0.8)",
            },
            series: [
                {
                    name: "访问量",
                    data: [150, 230, 224, 218, 135],
                    type: "bar",
                },
                {
                    name: "点赞量",
                    data: [150, 230, 224, 218, 135],
                    type: "bar",
                },


                {
                    name: "评论量",
                    data: [10, 30, 24, 18, 5],
                    type: "bar",
                },
                {
                    name: "新增粉丝数",
                    data: [50, 130, 124, 18, 35],
                    yAxisIndex: 1,
                    type: "line",
                    smooth: true,
                },
            ]
        };
        chartInstance.setOption(option);

    }, [])

    return (
        <div className="site-statistic-demo-card">
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总文章数"
                            value={allarticle}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                            prefix={<EditOutlined />}
                            suffix="篇"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总获赞量"
                            value={allgood}
                            valueStyle={{
                                color: '#3f8600',
                                // textAlign: 'center'
                            }}
                            prefix={<HeartOutlined />}
                            suffix="个"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card >
                        <Statistic
                            title="总评论量"
                            value={allcomment}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                            prefix={<MessageOutlined />}
                            suffix="条"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总访问量"
                            value={allview}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                            prefix={<FireOutlined />}
                            suffix="次"
                        />
                    </Card>
                </Col>
            </Row>


            <div style={{ textAlign: "left" }}>
                <h2>博客数据统计图</h2>
                <div ref={chartRef} style={{ height: "500px", width: "800px", textAlign: "left" }}></div>
            </div>
        </div>



        // <div className='info'>
        //     {/* <div className='home-box'>
        //         <div className='home-infoname'>总浏览量</div>
        //         <div className='count-data'><FireOutlined /> {allview}</div>
        //     </div>
        //     <div className='home-box'>
        //         <div className='home-infoname'>总点赞量</div>
        //         <div className='count-data'><HeartOutlined /> {allgood}</div>
        //     </div>
        //     <div className='home-box'>
        //         <div className='home-infoname'>总评论量</div>
        //         <div className='count-data'><MessageOutlined /> {allcomment}</div>
        //     </div> */}
        // </div>
    )
}

export default Data