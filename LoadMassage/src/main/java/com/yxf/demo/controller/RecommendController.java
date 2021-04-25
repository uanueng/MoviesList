package com.yxf.demo.controller;


import com.yxf.demo.util.GenericResult;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("recommend")
public class RecommendController {

    @RequestMapping("load")
    public GenericResult loadMovies(@RequestBody List<Integer> list){
        GenericResult<List<Map<String, Object>>> result = new GenericResult<>();

        try {
            List<Map<String, Object>> movies = new ArrayList<>();
            result.setData(movies);
        }catch (Exception e){
            e.printStackTrace();
            result.setSuccess(false);
        }
        return result;
    }
}
