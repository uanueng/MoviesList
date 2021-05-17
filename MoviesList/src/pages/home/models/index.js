import { getRecommendList, getUserName, loadMoviesList } from '../service/index';

export default {
    namespace: 'homePageManage',
    state: {
        username: '',
        movieList: [],
    },
    effects: {
        * getRecommendList({ payload, callback }, { call }) {
            console.log(payload);
            const response = yield call(getRecommendList, payload);
            callback(response);
        },
        * getUserName({ payload, callback }, { call }) {
            console.log(typeof payload);
            const response = yield call(getUserName, payload);
            callback(response);
        },
        * loadMoviesList({ payload, callback }, { call ,put}) {
            console.log("payload:",payload);
            const response = yield call(loadMoviesList, payload)
            console.log("resp:",response);
            yield put({
                type:"save",
                payload:{
                    movieList: response.data
                }
            })
            callback(response)
        },
    },
    reducers: {
        save(state, {payload}){
            return {
                ...state,
                ...payload
            }
        }
    },
};