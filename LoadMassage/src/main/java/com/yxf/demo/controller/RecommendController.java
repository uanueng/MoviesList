package com.yxf.demo.controller;


import com.yxf.demo.entity.Movie;
import com.yxf.demo.service.RecommendService;
import com.yxf.demo.util.GenericResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("recommend")
public class RecommendController {

    @Autowired
    private RecommendService recommendService;

    @CrossOrigin
    @RequestMapping("loadByIdList")
    public GenericResult loadMovies(@RequestBody List<Integer> ids){
        GenericResult<List<Movie>> result = new GenericResult<>();
        try {
            List<Movie> movies = recommendService.loadByIdList(ids);
            result.setData(movies);
        }catch (Exception e){
            e.printStackTrace();
            result.setSuccess(false);
        }
        return result;
    }
}
