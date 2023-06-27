import React,{useState} from 'react';
import { Layout, Menu, Breadcrumb} from 'antd';
import {UserOutlined, BarsOutlined, FormOutlined ,MessageOutlined, BarChartOutlined} from '@ant-design/icons';
import AddArticle from './AddArticle';
import ArticleList from './ArticleList';
import Header from './Header';
import CommentList from './CommentList';
import UserList from './UserList';
import Data from './Data';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import history from "../lib/history"

const { Content, Footer, Sider } = Layout;


function Adminhome(props){

  const [collapsed,setCollapsed] = useState(false)

  const menuItems = [
    {
      key:'1',
      label: '文章列表',
      icon: <BarsOutlined />
    },
    {
      key: '2',
      label: '添加文章',
      icon: <FormOutlined />,
    },
    {
      key: '3',
      label: '留言管理',
      icon: <MessageOutlined />
    },
    {
      key: '4',
      label: '用户管理',
      icon: <UserOutlined/>,
    },
    {
      key: '5',
      label: '数据统计',
      icon: <BarChartOutlined />,
    },
  ]

  const handleClickArticle = e => {
    if(e.key === '1') {
      history.push('/admin');
    }
    else if(e.key === '2') {
      history.push('/admin/add');
    }else if(e.key === '3') {
      history.push('/admin/comment');
    }else if(e.key === '4'){
      history.push('/admin/user');
    }else if(e.key === '5'){
      history.push('/admin/data');
    }
  }

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" 
            onClick={handleClickArticle}
            items={menuItems} />
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
            <Header />
            <div className='home-back' style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
                <Routes>
                  <Route exact path='/' element={ <ArticleList />}></Route>
                  <Route exact path='/add' element={<AddArticle props={props}/>}></Route>
                  <Route exact path='/comment' element={<CommentList />}></Route>
                  <Route exact path='/user' element={<UserList />}></Route>
                  <Route exact path='/data' element={<Data />}></Route>
                </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    )

}

export default Adminhome