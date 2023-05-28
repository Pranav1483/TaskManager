package com.pranav.taskmgmt.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pranav.taskmgmt.models.Todo;
import com.pranav.taskmgmt.repositories.TodoRepository;

@Service
public class TodoServiceImpl implements TodoService {
    TodoRepository todoRepository;

    public TodoServiceImpl(TodoRepository todoRepository){
        this.todoRepository = todoRepository;
    }

    public Todo saveTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public List<Todo> getAllTodos() {
        List<Todo> todos = new ArrayList<>();
        todoRepository.findAll().forEach(todos::add);
        return todos;
    }

    public List<Todo> getTodosByUserId(Long userId) {
        List<Todo> todos = todoRepository.findByUserId(userId);
        return todos;
    }

    public Todo getTodoByTitle(String title) {
        return todoRepository.findByTitle(title);
    }

    public void deleteTodobyTitle(String title) {
        Todo todo = getTodoByTitle(title);
        todoRepository.deleteById(todo.getId());
    }
}
