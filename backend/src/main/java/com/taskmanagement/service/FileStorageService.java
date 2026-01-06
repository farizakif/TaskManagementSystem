package com.taskmanagement.service;

import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.model.FileAttachment;
import com.taskmanagement.model.Task;
import com.taskmanagement.repository.FileAttachmentRepository;
import com.taskmanagement.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class FileStorageService {
    
    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);
    
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;
    
    @Autowired
    private FileAttachmentRepository fileAttachmentRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    public FileAttachment saveFile(MultipartFile file, Long taskId) throws IOException {
        logger.info("Saving file: {} for task ID: {}", file.getOriginalFilename(), taskId);
        
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
            : "";
        String filename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(filename);
        
        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Create file attachment entity
        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setFileName(filename);
        fileAttachment.setOriginalFileName(originalFilename);
        fileAttachment.setFilePath(filePath.toString());
        fileAttachment.setFileSize(file.getSize());
        fileAttachment.setContentType(file.getContentType());
        fileAttachment.setTask(task);
        
        fileAttachment = fileAttachmentRepository.save(fileAttachment);
        logger.info("File saved successfully with ID: {}", fileAttachment.getId());
        
        return fileAttachment;
    }
    
    public Resource loadFileAsResource(Long fileId) throws IOException {
        logger.debug("Loading file with ID: {}", fileId);
        
        FileAttachment fileAttachment = fileAttachmentRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        
        Path filePath = Paths.get(fileAttachment.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            logger.error("File not found or not readable: {}", filePath);
            throw new ResourceNotFoundException("File not found or not readable");
        }
    }
    
    public void deleteFile(Long fileId) throws IOException {
        logger.info("Deleting file with ID: {}", fileId);
        
        FileAttachment fileAttachment = fileAttachmentRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        
        // Delete physical file
        Path filePath = Paths.get(fileAttachment.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
            logger.debug("Physical file deleted: {}", filePath);
        }
        
        // Delete database record
        fileAttachmentRepository.delete(fileAttachment);
        logger.info("File deleted successfully with ID: {}", fileId);
    }
    
    public List<FileAttachment> getFilesByTaskId(Long taskId) {
        logger.debug("Getting files for task ID: {}", taskId);
        return fileAttachmentRepository.findByTaskId(taskId);
    }
    
    public FileAttachment getFileById(Long fileId) {
        logger.debug("Getting file by ID: {}", fileId);
        return fileAttachmentRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
    }
}

