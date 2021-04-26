package com.yxf.demo.controller;


import com.yxf.demo.entity.User;
import com.yxf.demo.service.UserService;
import com.yxf.demo.util.GenericResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping("switch")
    public GenericResult<Map<String, Object>> switchUser(@RequestBody Integer id) {
        GenericResult<Map<String, Object>> result = new GenericResult<>();
        Map<String, Object> map = new HashMap<>();
        try {
            int userCount = userService.getUserCount();
            if (userCount == 0) {
                map.put("id", id);
                map.put("name", "");
            } else {
                id = (id + 1) % userCount;
                User user = userService.getUserById(id);
                map.put("id", user.getUserId());
                map.put("name", user.getUserName());
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.setSuccess(false);
        }
        result.setData(map);
        return result;
    }
}
