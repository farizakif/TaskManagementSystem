package com.taskmanagement.config;

import com.taskmanagement.model.*;
import com.taskmanagement.repository.TaskRepository;
import com.taskmanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            logger.info("Initializing sample data...");
            createSampleUsers();
            createSampleTasks();
            logger.info("Sample data initialized successfully");
        } else {
            logger.info("Database already contains data, skipping initialization");
        }
    }
    
    private void createSampleUsers() {
        // Admin users
        User admin1 = new User();
        admin1.setEmail("admin1@taskmanagement.com");
        admin1.setPassword(passwordEncoder.encode("admin123"));
        admin1.setFirstName("Admin");
        admin1.setLastName("One");
        admin1.setRole(Role.ADMIN);
        admin1.setCreatedAt(LocalDateTime.now());
        admin1.setUpdatedAt(LocalDateTime.now());
        userRepository.save(admin1);
        
        User admin2 = new User();
        admin2.setEmail("admin2@taskmanagement.com");
        admin2.setPassword(passwordEncoder.encode("admin123"));
        admin2.setFirstName("Admin");
        admin2.setLastName("Two");
        admin2.setRole(Role.ADMIN);
        admin2.setCreatedAt(LocalDateTime.now());
        admin2.setUpdatedAt(LocalDateTime.now());
        userRepository.save(admin2);
        
        // Member users
        List<String> firstNames = Arrays.asList("John", "Jane", "Bob", "Alice", "Charlie");
        List<String> lastNames = Arrays.asList("Smith", "Doe", "Johnson", "Williams", "Brown");
        
        for (int i = 0; i < 5; i++) {
            User member = new User();
            member.setEmail("member" + (i + 1) + "@taskmanagement.com");
            member.setPassword(passwordEncoder.encode("member123"));
            member.setFirstName(firstNames.get(i));
            member.setLastName(lastNames.get(i));
            member.setRole(Role.MEMBER);
            member.setCreatedAt(LocalDateTime.now());
            member.setUpdatedAt(LocalDateTime.now());
            userRepository.save(member);
        }
        
        logger.info("Created 2 admin users and 5 member users");
    }
    
    private void createSampleTasks() {
        List<User> users = userRepository.findAll();
        List<User> members = users.stream()
                .filter(u -> u.getRole() == Role.MEMBER)
                .toList();
        
        if (members.isEmpty()) {
            logger.warn("No members found, cannot create sample tasks");
            return;
        }
        
        Random random = new Random();
        List<String> titles = Arrays.asList(
            "Implement user authentication",
            "Design database schema",
            "Create REST API endpoints",
            "Build frontend components",
            "Write unit tests",
            "Setup CI/CD pipeline",
            "Optimize database queries",
            "Implement caching strategy",
            "Add error handling",
            "Create documentation",
            "Setup monitoring",
            "Implement logging",
            "Add input validation",
            "Create admin dashboard",
            "Implement file upload",
            "Add search functionality",
            "Create task filters",
            "Implement pagination",
            "Add email notifications",
            "Create API documentation"
        );
        
        List<String> descriptions = Arrays.asList(
            "Implement JWT-based authentication system",
            "Design and create database tables with proper relationships",
            "Create RESTful API endpoints for all operations",
            "Build responsive React components",
            "Write comprehensive unit tests for all services",
            "Setup continuous integration and deployment",
            "Optimize slow database queries",
            "Implement Redis caching for better performance",
            "Add comprehensive error handling throughout the application",
            "Create detailed API and user documentation"
        );
        
        TaskStatus[] statuses = TaskStatus.values();
        Priority[] priorities = Priority.values();
        
        for (int i = 0; i < 20; i++) {
            Task task = new Task();
            task.setTitle(titles.get(i % titles.size()));
            task.setDescription(descriptions.get(i % descriptions.size()));
            task.setStatus(statuses[random.nextInt(statuses.length)]);
            task.setPriority(priorities[random.nextInt(priorities.length)]);
            
            // Random due date within next 30 days
            task.setDueDate(LocalDate.now().plusDays(random.nextInt(30)));
            
            // Assign to random member
            task.setCreatedBy(members.get(random.nextInt(members.size())));
            
            // 70% chance of being assigned to someone
            if (random.nextDouble() < 0.7) {
                task.setAssignedTo(members.get(random.nextInt(members.size())));
            }
            
            task.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(10)));
            task.setUpdatedAt(LocalDateTime.now().minusDays(random.nextInt(5)));
            
            taskRepository.save(task);
        }
        
        logger.info("Created 20 sample tasks");
    }
}

