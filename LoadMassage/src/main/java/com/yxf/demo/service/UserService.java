package com.yxf.demo.service;

import com.yxf.demo.entity.User;

public interface UserService {

    int getUserCount();

    User getUserById(Integer id);
}
