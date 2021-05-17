import styles from './index.css';
import React from 'react';
import MovieCard from '@/components/MovieCard/index';
import { connect } from 'dva';

@connect(({ homePageManage }) => ({ homePageManage }))
class List extends React.Component {
    constructor(props) {
        super(props);
    }

    showMovieList = (list) => {
        console.log("length",list);
        if (list){
            return (
                list.map((item, index) => {
                    return <MovieCard item={item} key={index}/>
            }))

        }
    }

    render() {
        const { homePageManage: { movieList } } = this.props;

        return (
            <div className={styles.normal}>
                {this.showMovieList(movieList)}
            </div>
        );
    }
}

export default List;
