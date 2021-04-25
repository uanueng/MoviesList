import styles from './index.css';
import React from 'react';
import { Layout, Menu, Col, Row } from 'antd';

const { Header, Content, Footer } = Layout;
const { MenuItem } = Menu;

class BasicLayout extends React.Component {
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
                    <Col span={3}></Col>
                </Header>
                <Content className={styles.content}>{this.props.children}</Content>
                <Footer className={styles.footer}>Copyright @ uanueng 2021</Footer>
            </Layout>
        );
    }
}

export default BasicLayout;
