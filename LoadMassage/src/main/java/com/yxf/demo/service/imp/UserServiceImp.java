package com.yxf.demo.service.imp;

import com.yxf.demo.entity.User;
import com.yxf.demo.mapper.UserMapper;
import com.yxf.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public int getUserCount() {
        return userMapper.getUserCount();
    }

    @Override
    public User getUserById(Integer id) {
        return userMapper.getUserById(id);
    }
}
