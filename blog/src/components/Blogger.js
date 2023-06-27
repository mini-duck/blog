import { Avatar, Divider } from 'antd'
// import { FireOutlined }from '@ant-design/icons'
import '../styles/components/Blogger.css'

const Blogger = () => {
    return(
        <div className='blogger-div'>
            {/* <div className='avatar'><Avatar size={100} src={require("../styles/components/picture.jpg")} alt='avatar' /></div> */}
            <div className='avatar'><Avatar size={100} src={require("../styles/components/hxy.jpg")} alt='avatar' /></div>
            <Divider>♥</Divider>
            <div className='blogger-introduction'>
                欢迎来到我的个人博客
            </div>
        </div>
    )
}

export default Blogger