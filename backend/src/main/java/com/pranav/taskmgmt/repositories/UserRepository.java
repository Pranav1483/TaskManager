package com.pranav.taskmgmt.repositories;

import org.springframework.data.repository.CrudRepository;

import com.pranav.taskmgmt.models.User;

public interface UserRepository extends CrudRepository<User, Long>{
    User findByUsername(String username);
    User findByEmail(String email);
}
