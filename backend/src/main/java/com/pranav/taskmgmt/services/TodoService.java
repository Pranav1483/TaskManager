package com.pranav.taskmgmt.services;

import java.util.List;

import com.pranav.taskmgmt.models.Todo;

public interface TodoService {
    Todo saveTodo(Todo todo);
    List<Todo> getAllTodos();
    List<Todo> getTodosByUserId(Long userId);
    Todo getTodoByTitle(String title);
    void deleteTodobyTitle(String title);
}
