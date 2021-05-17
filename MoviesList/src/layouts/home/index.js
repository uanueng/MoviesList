import styles from './index.css';
import React from 'react';
import { Layout, Menu, Col, Row, Button, Spin } from 'antd';
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
            loading:false
        };
    }

    componentDidMount() {
        console.log("load");
        this.switchUser(-1)
    }

    loadMovieList = () => {
        const { dispatch } = this.props;
        const t = this;
        this.setState({
            loading:true
        })
        console.log("+++++++");
        dispatch({
            type: 'homePageManage/getRecommendList',
            payload: this.state.id,
            callback: data => {
                if (data.success) {
                    console.log(data);
                    const list = data.list;
                    dispatch({
                        type:'homePageManage/loadMoviesList',
                        payload:list,
                        callback: data => {
                            if (data.success){
                                t.setState({
                                    movieList:data.data,
                                    loading:false
                                })
                                console.log(t.state.movieList);
                            }
                        }
                    });
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
                        id:this.state.id+1,
                        username:data.data.name
                    })
                    t.loadMovieList()
                }
            },
        });
    }

    render() {
        // const { homePageManage } = this.props
        // console.log(homePageManage);
        return (
            <Layout className={styles.normal}>
                <Header className={styles.header}>
                    <Col span={4}></Col>
                    <Col span={18}>
                        <Menu className={styles.menu} mode="horizontal" defaultSelectedKeys={['home']}>
                            <Menu.Item className={styles.item} key="home">首页</Menu.Item>
                            <Menu.Item className={styles.item} key="sort">排行</Menu.Item>
                            <Menu.Item className={styles.item} key="kind">分类</Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={4} className={styles.user}>
                        <div className={ styles.username }>{this.state.username}</div>
                        <div className={styles.changebtn}>
                            <Button className={styles.changebtn} onClick={()=>this.switchUser(this.state.id)}>切换用户</Button>
                        </div>
                    </Col>
                </Header>
                <Spin spinning={this.state.loading} >
                    <div className={styles.content}>
                        {this.props.children}
                    </div>
                </Spin>
                <Footer className={styles.footer}>Copyright @ uanueng 2021</Footer>
            </Layout>
        );
    }
}

export default BasicLayout;
