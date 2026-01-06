package com.taskmanagement.controller;

import com.taskmanagement.model.FileAttachment;
import com.taskmanagement.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {
    
    private static final Logger logger = LoggerFactory.getLogger(FileController.class);
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @PostMapping("/upload")
    public ResponseEntity<FileAttachment> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("taskId") Long taskId) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            
            logger.info("File upload request - taskId: {}, filename: {}, size: {}", 
                    taskId, file.getOriginalFilename(), file.getSize());
            
            FileAttachment fileAttachment = fileStorageService.saveFile(file, taskId);
            return ResponseEntity.ok(fileAttachment);
        } catch (IOException e) {
            logger.error("File upload failed: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            logger.error("File upload error: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        try {
            logger.info("File download request - fileId: {}", id);
            
            FileAttachment fileAttachment = fileStorageService.getFileById(id);
            Resource resource = fileStorageService.loadFileAsResource(id);
            
            String contentType = fileAttachment.getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            String encodedFileName = URLEncoder.encode(fileAttachment.getOriginalFileName(), StandardCharsets.UTF_8.toString())
                    .replace("+", "%20");
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + encodedFileName + "\"")
                    .body(resource);
        } catch (Exception e) {
            logger.error("File download failed: ", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        try {
            logger.info("File delete request - fileId: {}", id);
            fileStorageService.deleteFile(id);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            logger.error("File delete failed: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            logger.error("File delete error: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
