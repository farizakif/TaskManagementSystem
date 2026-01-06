package com.taskmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileResponse {
    private Long id;
    private String fileName;
    private String originalFileName;
    private Long fileSize;
    private String contentType;
    private LocalDateTime createdAt;
}

