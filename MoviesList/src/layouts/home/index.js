import styles from './index.css';
import React from 'react';
import { Layout, Menu, Col, Row, Button } from 'antd';
import { connect } from 'dva';

const { Header, Content, Footer } = Layout;
const { MenuItem } = Menu;

@connect(({ homePageManage }) => ({ homePageManage }))
class BasicLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id:0,
            username: '',
            movieList: [],
        };
    }

    componentDidMount() {
        console.log("load");
        this.switchUser(-1)
        this.loadMovieList()
    }

    loadMovieList = () => {
        const { dispatch } = this.props;
        console.log("+++++++");
        dispatch({
            type: 'homePageManage/loadMovieList',
            payload: this.state.id,
            callback: data => {
                if (data.success) {
                    console.log(data);
                } else {

                }
            },
        });
        console.log("------");
    };

    switchUser = (id) => {
        const { dispatch } = this.props;
        const t = this;
        dispatch({
            type: 'homePageManage/getUserName',
            payload: id+1,
            callback: data => {
                if (data.success){
                    console.log(data);
                    this.setState({
                        id:this.state.id,
                        username:data.username
                    })
                    t.loadMovieList()
                }else {

                }
            },
        });
    }

    render() {
        return (
            <Layout className={styles.normal}>
                <Header className={styles.header}>
                    <Col span={3}></Col>
                    <Col span={18}>
                        <Menu className={styles.menu} mode="horizontal" defaultSelectedKeys={['home']}>
                            <Menu.Item className={styles.item} key="home">首页</Menu.Item>
                            <Menu.Item className={styles.item} key="sort">排行</Menu.Item>
                            <Menu.Item className={styles.item} key="kind">分类</Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={3} className={styles.user}>
                        <div className={ styles.username }>username</div>
                        <div>
                            <Button className={styles.changebtn} onClick={()=>this.switchUser(this.state.id)}>切换用户</Button>
                        </div>
                    </Col>
                </Header>
                <Content className={styles.content}>{this.props.children}</Content>
                <Footer className={styles.footer}>Copyright @ uanueng 2021</Footer>
            </Layout>
        );
    }
}

export default BasicLayout;
