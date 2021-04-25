import styles from './index.css';
import React from 'react';

class Index extends React.Component {
    render() {
        return (
            <div className={styles.card}>
                <div className={styles.img}>
                    <img className={styles.img} src="https://puui.qpic.cn/vcover_vt_pic/0/deyzhnzo65ik79t1572019753/220"/>
                    <div className={styles.stars}>
                        <div className={styles.time}>01:30:34</div>
                        <div className={styles.num}>9.7</div>
                    </div>
                </div>
                <div className={styles.message}>
                    <div className={styles.name}>我们的父辈</div>
                    <div className={styles.brief}>111</div>
                </div>
            </div>
        );
    }
}

export default Index;
