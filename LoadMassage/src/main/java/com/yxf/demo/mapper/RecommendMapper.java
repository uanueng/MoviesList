package com.yxf.demo.mapper;

import com.yxf.demo.entity.Movie;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
@Mapper
public interface RecommendMapper {

    Movie loadByIdList(Integer id);
}
