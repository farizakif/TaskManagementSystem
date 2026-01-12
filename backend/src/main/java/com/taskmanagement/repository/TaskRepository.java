package com.taskmanagement.repository;

import com.taskmanagement.model.Task;
import com.taskmanagement.model.TaskStatus;
import com.taskmanagement.model.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByAssignedToId(Long assignedTo);
    
    List<Task> findByCreatedById(Long createdById);
    
    List<Task> findByStatus(TaskStatus status);
    
    List<Task> findByPriority(Priority priority);
    
    @Query("""
SELECT t FROM Task t
WHERE (:title IS NULL OR LOWER(t.title) LIKE :title)
AND (:status IS NULL OR t.status = :status)
AND (:priority IS NULL OR t.priority = :priority)
AND (:assignedTo IS NULL OR t.assignedTo.id = :assignedTo)
""")
List<Task> searchTasks(
        @Param("title") String title,
        @Param("status") TaskStatus status,
        @Param("priority") Priority priority,
        @Param("assignedTo") Long assignedTo
);



    
    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId OR t.createdBy.id = :userId")
    List<Task> findMyTasks(@Param("userId") Long userId);
}

