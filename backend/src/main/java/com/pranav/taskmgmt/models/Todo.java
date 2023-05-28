package com.pranav.taskmgmt.models;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {
    
    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(nullable = false)
    private String description;

    @ElementCollection
    @MapKeyColumn(name = "subtask_name")
    @Column(name = "status")
    private Map<String, String> subtasks;

    private LocalDateTime startTimestamp;

    @Column(nullable = false)
    private LocalDateTime endTimestamp;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private boolean starred;

    @Column(nullable = false)
    private boolean finished;

    @PrePersist
    private void prePersist() {
        this.startTimestamp = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
    }
}
