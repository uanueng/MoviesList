import  { loadMovieList, getUserName } from '../service/index'

export default {
    namespace:'homePageManage',
    state:{
        username:'',
        movieList:[]
    },
    effects:{
        *loadMovieList({payload,callback},{call}){
            console.log(payload);
            const response = yield call(loadMovieList,payload);
            callback(response)
        },
        *getUserName({payload,callback},{call}){
            console.log(typeof payload);
            const response = yield call(getUserName,payload);
            callback(response)
        }
    },
    reducers:{

    }
}