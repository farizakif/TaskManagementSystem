package com.taskmanagement.dto;

import com.taskmanagement.model.Priority;
import com.taskmanagement.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Status is required")
    private TaskStatus status;
    
    @NotNull(message = "Priority is required")
    private Priority priority;
    
    private LocalDate dueDate;
    
    private Long assignedToId;
}

