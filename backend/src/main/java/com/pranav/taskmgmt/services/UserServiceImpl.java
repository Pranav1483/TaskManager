package com.pranav.taskmgmt.services;

import org.springframework.stereotype.Service;

import com.pranav.taskmgmt.models.User;
import com.pranav.taskmgmt.repositories.UserRepository;


@Service
public class UserServiceImpl implements UserService {
    UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user){
        return userRepository.save(user);
    }

    public User getUserbyUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getUserbyEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
