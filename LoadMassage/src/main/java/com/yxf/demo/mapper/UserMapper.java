package com.yxf.demo.mapper;

import com.yxf.demo.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Repository
@Mapper
public interface UserMapper {
    int getUserCount();

    User getUserById(Integer id);
}
