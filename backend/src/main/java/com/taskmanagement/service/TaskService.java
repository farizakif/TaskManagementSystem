package com.taskmanagement.service;

import com.taskmanagement.dto.FileResponse;
import com.taskmanagement.dto.TaskRequest;
import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.exception.BadRequestException;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.exception.UnauthorizedException;
import com.taskmanagement.model.*;
import com.taskmanagement.repository.TaskRepository;
import com.taskmanagement.repository.UserRepository;
import com.taskmanagement.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    public TaskResponse createTask(TaskRequest request, UserDetails currentUser) {
        logger.info("Creating task: {} by user: {}", request.getTitle(), currentUser.getUsername());
        
        User user = userRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setCreatedBy(user);
        
        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));
            task.setAssignedTo(assignedTo);
            logger.debug("Task assigned to user ID: {}", request.getAssignedToId());
        }
        
        task = taskRepository.save(task);
        logger.info("Task created successfully with ID: {}", task.getId());
        return mapToResponse(task);
    }
    
    public TaskResponse updateTask(Long id, TaskRequest request, UserDetails currentUser) {
        logger.info("Updating task ID: {} by user: {}", id, currentUser.getUsername());
        
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        User user = userRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Only creator or assigned user can update
        if (!task.getCreatedBy().getId().equals(user.getId()) && 
            (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(user.getId()))) {
            logger.warn("Unauthorized update attempt on task ID: {} by user: {}", id, currentUser.getUsername());
            throw new UnauthorizedException("Unauthorized to update this task");
        }
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        
        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedTo(assignedTo);
        } else {
            task.setAssignedTo(null);
        }
        
        task = taskRepository.save(task);
        logger.info("Task updated successfully with ID: {}", task.getId());
        return mapToResponse(task);
    }
    
    public TaskResponse getTaskById(Long id) {
        logger.debug("Fetching task by ID: {}", id);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        return mapToResponse(task);
    }
    
    public List<TaskResponse> getAllTasks() {
        logger.debug("Fetching all tasks");
        List<TaskResponse> tasks = taskRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        logger.debug("Found {} tasks", tasks.size());
        return tasks;
    }
    
    public List<TaskResponse> searchTasks(String search, TaskStatus status, Priority priority, Long assignedToId) {
        logger.debug("Searching tasks with filters - search: {}, status: {}, priority: {}, assignedToId: {}", 
                search, status, priority, assignedToId);
        List<TaskResponse> tasks = taskRepository.searchTasks(search, status, priority, assignedToId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        logger.debug("Found {} tasks matching criteria", tasks.size());
        return tasks;
    }
    
    public List<TaskResponse> getMyTasks(UserDetails currentUser) {
        logger.info("Fetching my tasks for user: {}", currentUser.getUsername());
        User user = userRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<TaskResponse> tasks = taskRepository.findMyTasks(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        logger.debug("Found {} tasks for user", tasks.size());
        return tasks;
    }
    
    public void deleteTask(Long id, UserDetails currentUser) {
        logger.info("Deleting task ID: {} by user: {}", id, currentUser.getUsername());
        
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        User user = userRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Only creator can delete
        if (!task.getCreatedBy().getId().equals(user.getId())) {
            logger.warn("Unauthorized delete attempt on task ID: {} by user: {}", id, currentUser.getUsername());
            throw new UnauthorizedException("Unauthorized to delete this task");
        }
        
        taskRepository.delete(task);
        logger.info("Task deleted successfully with ID: {}", id);
    }
    
    public TaskResponse updateTaskFile(Long id, String fileName, String filePath) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setFileName(fileName);
        task.setFilePath(filePath);
        
        task = taskRepository.save(task);
        return mapToResponse(task);
    }
    
    public TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setDueDate(task.getDueDate());
        response.setCreatedById(task.getCreatedBy().getId());
        response.setCreatedByFirstName(task.getCreatedBy().getFirstName());
        response.setCreatedByLastName(task.getCreatedBy().getLastName());
        
        if (task.getAssignedTo() != null) {
            response.setAssignedToId(task.getAssignedTo().getId());
            response.setAssignedToFirstName(task.getAssignedTo().getFirstName());
            response.setAssignedToLastName(task.getAssignedTo().getLastName());
        }
        
        response.setFileName(task.getFileName());
        
        // Map file attachments
        List<FileResponse> files = fileStorageService.getFilesByTaskId(task.getId()).stream()
                .map(file -> {
                    FileResponse fileResponse = new FileResponse();
                    fileResponse.setId(file.getId());
                    fileResponse.setFileName(file.getFileName());
                    fileResponse.setOriginalFileName(file.getOriginalFileName());
                    fileResponse.setFileSize(file.getFileSize());
                    fileResponse.setContentType(file.getContentType());
                    fileResponse.setCreatedAt(file.getCreatedAt());
                    return fileResponse;
                })
                .collect(Collectors.toList());
        response.setFiles(files);
        
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        
        return response;
    }
}

