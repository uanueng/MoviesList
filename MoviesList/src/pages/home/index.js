import styles from './index.css';
import React from 'react';
import MovieCard from '@/components/MovieCard/index';
import {connect} from 'dva';

@connect(({ homePageManage }) => ({ homePageManage }))
class List extends React.Component {


    render() {
        return (
            <div className={styles.normal}>
                <MovieCard/>
                <MovieCard/>
                <MovieCard/>
                <MovieCard/>
                <MovieCard/>
                <MovieCard/>
            </div>
        );
    }
}

export default List;
