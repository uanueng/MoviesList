package com.yxf.demo.service.imp;

import com.yxf.demo.entity.Movie;
import com.yxf.demo.mapper.RecommendMapper;
import com.yxf.demo.service.RecommendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RecommendServiceImp implements RecommendService {

    @Autowired
    private RecommendMapper recommendMapper;

    @Override
    public List<Movie> loadByIdList(List<Integer> ids) {
        System.out.println(ids.toString());
        List<Movie> list = new ArrayList<>();
        try{
            for(Integer id : ids){
                Movie movie = recommendMapper.loadByIdList(id);
                list.add(movie);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return list;
    }
}
