import request from 'umi-request';
import {NcfNet, DataUrl } from "../../../../pubilc/config/common"

export async function getRecommendList(params) {
    return request.get(NcfNet+"predict/"+params)
}

export async function getUserName(params) {
    return request(DataUrl+"user/switch/"+params,{
        method:'GET',
        headers:{
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin':'*'
        }
    })
}

export async function loadMoviesList(params) {
    return  request(DataUrl+"recommend/loadByIdList",{
        method: 'POST',
        data:params,
        headers:{
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Origin':'*'
        }
    });
}