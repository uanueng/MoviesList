package com.yxf.demo.service;

import com.yxf.demo.entity.Movie;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RecommendService {
    List<Movie> loadByIdList(List<Integer> ids);
}
