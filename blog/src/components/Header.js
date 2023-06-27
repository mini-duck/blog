import React from 'react'
import { SearchOutlined, HomeOutlined, ControlOutlined } from '@ant-design/icons'
import { Row, Col, Input, Button } from 'antd'
import '../styles/components/Header.css'

const Header = () => {
    // let input = this.input.value;, Menu,
    return (
        <div className='header'>
            <Row type="flex" justify="center">
                <Col >
                    <span className="header-text">红心柚的博客</span>
                </Col>

                 <Col className='search'>
                    <Input placeholder="请输入文章搜索内容" />
                </Col>
               <Col className='search-icon'>
                    <SearchOutlined />   
                </Col>

                <Col className='home' >
                    <Button href='/' icon={<HomeOutlined />}>首页</Button>
                </Col>
                <Col className='admin'>
                    <Button href='http://127.0.0.1:3000/login' icon={<ControlOutlined />}>后台</Button>
                </Col>
                
            </Row>
        </div>
    )

}

export default Header