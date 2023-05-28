package com.pranav.taskmgmt.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Users")
public class User {
    
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    private Long id;

    @Column(nullable = false)
    @Pattern(regexp = "[a-zA-Z]+", message = "Name cannot contain numbers or special characters")
    private String fname;

    @Column(nullable = false)
    @Pattern(regexp = "[a-zA-Z]+", message = "Name cannot contain numbers or special characters")
    private String lname;

    @Email(message = "Please enter a valid Email")
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    @Pattern(regexp = "[a-zA-Z0-9_]+", message = "Username must contain only letters, numbers and underscore")
    private String username;

    @Column(nullable = false)
    @Size(min = 8, max = Integer.MAX_VALUE, message = "Password must be atleast 8 characters long")
    private String passkey;
}
