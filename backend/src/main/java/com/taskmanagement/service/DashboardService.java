package com.taskmanagement.service;

import com.taskmanagement.dto.DashboardStatsResponse;
import com.taskmanagement.dto.TaskResponse;
import com.taskmanagement.model.Priority;
import com.taskmanagement.model.TaskStatus;
import com.taskmanagement.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private TaskService taskService;
    
    public DashboardStatsResponse getDashboardStats() {
        logger.info("Fetching dashboard statistics");
        
        Long totalTasks = taskRepository.count();
        
        // Tasks by status
        Map<String, Long> tasksByStatus = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            long count = taskRepository.findByStatus(status).size();
            tasksByStatus.put(status.name(), count);
        }
        
        // Tasks by priority
        Map<String, Long> tasksByPriority = new HashMap<>();
        for (Priority priority : Priority.values()) {
            long count = taskRepository.findByPriority(priority).size();
            tasksByPriority.put(priority.name(), count);
        }
        
        // Recent tasks (last 5)
        List<TaskResponse> recentTasks = taskRepository.findAll().stream()
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .limit(5)
                .map(taskService::mapToResponse)
                .collect(Collectors.toList());
        
        logger.debug("Dashboard stats - Total: {}, By Status: {}, By Priority: {}, Recent: {}", 
                totalTasks, tasksByStatus, tasksByPriority, recentTasks.size());
        
        return new DashboardStatsResponse(totalTasks, tasksByStatus, tasksByPriority, recentTasks);
    }
}

