import React from 'react'
import { Col, Row } from 'antd'
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons'

import '../styles/Header.css'

function Header() {
    return (
        <div className='headerBox'>
            <Row type="flex" justify="center">
                <Col >
                    <div className='blogBtn'>
                        <a href='http://127.0.0.1:3002'><HomeOutlined /></a>
                    </div>
                </Col>
                <Col>
                    <div className='logoutBtn'>
                        <a href='/login'><LogoutOutlined /></a>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Header 