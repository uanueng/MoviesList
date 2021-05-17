import styles from './index.css';
import React from 'react';

class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { item:{movieName, imgPath, time, brief, stars, type }} = this.props;

        return (
            <div className={styles.card}>
                <div className={styles.img}>
                    <img className={styles.img} src={imgPath}/>
                    <div className={styles.stars}>
                        <div className={styles.time}>{time}</div>
                        <div className={styles.num}>{(stars!=0 || stars!=null)?stars:"暂无数据"}</div>
                    </div>
                </div>
                <div className={styles.message}>
                    <div className={styles.name}>{movieName}</div>
                    <div className={styles.brief}>{brief}</div>
                </div>
            </div>
        );
    }
}

export default Index;
