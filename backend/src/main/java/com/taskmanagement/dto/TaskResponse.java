package com.taskmanagement.dto;

import com.taskmanagement.model.Priority;
import com.taskmanagement.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private LocalDate dueDate;
    private Long createdById;
    private String createdByFirstName;
    private String createdByLastName;
    private Long assignedToId;
    private String assignedToFirstName;
    private String assignedToLastName;
    private String fileName;
    private List<FileResponse> files;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

