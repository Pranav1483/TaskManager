package com.pranav.taskmgmt.services;

import com.pranav.taskmgmt.models.User;

public interface UserService {
    User saveUser(User user);
    User getUserbyUsername(String username);
    User getUserbyEmail(String email);
}
