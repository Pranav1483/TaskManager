package com.pranav.taskmgmt.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.pranav.taskmgmt.models.Todo;

public interface TodoRepository extends CrudRepository<Todo, Long> {
    List<Todo> findByUserId(Long userId);
    Todo findByTitle(String title);
}
