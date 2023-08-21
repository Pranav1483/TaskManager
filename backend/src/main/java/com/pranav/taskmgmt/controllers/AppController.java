package com.pranav.taskmgmt.controllers;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import com.pranav.taskmgmt.models.Todo;
import com.pranav.taskmgmt.models.User;
import com.pranav.taskmgmt.services.EmailService;
import com.pranav.taskmgmt.services.TodoService;
import com.pranav.taskmgmt.services.UserService;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class AppController {
    UserService userService;
    TodoService todoService;
    EmailService emailService;

    public AppController(UserService userService, TodoService todoService, EmailService emailService) {
        this.userService = userService;
        this.todoService = todoService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> createUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            FieldError firstError = bindingResult.getFieldErrors().get(0);
            String errorMessage = firstError.getDefaultMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
        }
        try {
            userService.saveUser(user);
            return ResponseEntity.ok("User Created Successfully");
        }   catch (DataIntegrityViolationException e) {
                String errMsg = "";
                String violatedField = e.getMessage();
                if (violatedField.contains("username")) {
                    errMsg = "Username already Exists";
                }
                else {
                    errMsg = "Email already Exists";
                }
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errMsg);
        }   catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error Occured ! Please Try Again");
        }
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username) {
        try {
            User user = userService.getUserbyUsername(username);
            if (user != null) {
                return ResponseEntity.ok(user);
            }
            else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/todo/create")
    public ResponseEntity<String> createTodo(@RequestBody Todo todo) {
        try {
            todoService.saveTodo(todo);
            return ResponseEntity.ok("Task Created Successfully");
        }   catch(DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Task with same Title already Exists !");
        }   catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error Occured ! Please Try Again");
        }
    }

    @GetMapping("/todo/{userId}")
    public ResponseEntity<List<Todo>> getTodos(@PathVariable Long userId) {
        List<Todo> todos = todoService.getTodosByUserId(userId);
        return ResponseEntity.ok(todos);
    }

    @PostMapping("/login")
    public ResponseEntity<String> userLogin(@RequestBody Map<String, String> credentials) {
        String recieved_username = credentials.get("username");
        String recieved_passkey = credentials.get("passkey");
        User user = userService.getUserbyUsername(recieved_username);
        if (user != null) {
            if (recieved_passkey.equals(user.getPasskey())) {
                return ResponseEntity.ok("OK");
            }
            else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Wrong Password !");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No User Found !");
    }

    @PutMapping("/update/todo/{title}")
    public ResponseEntity<String> updateTodo(@PathVariable("title") String title, @RequestBody Todo todo) {
        Todo todoFromDb = todoService.getTodoByTitle(title);
        todoFromDb.setSubtasks(todo.getSubtasks());
        todoFromDb.setDescription(todo.getDescription());
        todoFromDb.setEndTimestamp(todo.getEndTimestamp());
        todoFromDb.setFinished(todo.isFinished());
        todoFromDb.setStarred(todo.isStarred());
        todoService.saveTodo(todoFromDb);
        return ResponseEntity.status(HttpStatus.OK).body("Updated");
    }

    @PutMapping("/update/users/{email}")
    public ResponseEntity<String> updateUser(@PathVariable("email") String email, @RequestBody Map<String, String> details) {
        User userFromDb = userService.getUserbyEmail(email);
        userFromDb.setPasskey(details.get("passkey"));
        Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
        Set<ConstraintViolation<User>> violations = validator.validateProperty(userFromDb, "passkey");
        if (!violations.isEmpty()) {
            ConstraintViolation<User> firstViolation = violations.iterator().next();
            String errorMessage = firstViolation.getMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
        }
        userService.saveUser(userFromDb);
        return ResponseEntity.status(HttpStatus.OK).body("Updated");
    }

    @GetMapping("/test/{username}")
    public void testingFunc(@PathVariable String username) {
        User test_user = userService.getUserbyUsername(username);
        List<Todo> test_todos = todoService.getTodosByUserId(test_user.getId());
        if (test_todos != null) {
            Todo test_todo = test_todos.get(0);
            LocalDateTime s = test_todo.getStartTimestamp();
            LocalDateTime e = test_todo.getEndTimestamp();
            System.out.println(s);
            System.out.println(e);
            System.out.println(Duration.between(s, e));
            Map<String, String> test_subtask = test_todo.getSubtasks();
            test_subtask.put("Day 1: Spring Boot", "0");
            test_todo.setSubtasks(test_subtask);
            todoService.saveTodo(test_todo);

        }
    }

    @DeleteMapping("/todo/delete/{title}")
    public ResponseEntity<String> deleteTodo(@PathVariable("title") String title) {
        todoService.deleteTodobyTitle(title);
        return ResponseEntity.status(HttpStatus.OK).body("OK");
    }

    @PostMapping("/forgotpasskey")
    public ResponseEntity<String> checkEmail(@RequestBody Map<String, String> details) {
        String recieved_email = details.get("email");
        User check_user = userService.getUserbyEmail(recieved_email);
        if (check_user == null) {
            System.out.println(recieved_email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not Registered");
        }
        else {
            System.out.println("YES");
            Random random = new Random();
            String otp = String.valueOf(random.nextInt(900000) + 100000);
            String status = emailService.sendEmail(recieved_email, otp);
            return ResponseEntity.status(HttpStatus.OK).body(status);
        }
    }

    @GetMapping("/testing")
    public ResponseEntity<String> testingAPI() {
        return ResponseEntity.status(HttpStatus.OK).body("Working");
    }
}
