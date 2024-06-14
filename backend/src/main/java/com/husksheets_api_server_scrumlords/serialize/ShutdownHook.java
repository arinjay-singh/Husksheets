package com.husksheets_api_server_scrumlords.serialize;

import javax.annotation.PreDestroy;
import org.springframework.stereotype.Component;
import com.husksheets_api_server_scrumlords.models.Publishers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * ShutdownHook class: Serialize the publishers object on shutdown.
 * @author Kaan Tural
 */
@Component
public class ShutdownHook {
    private String filePath;

    public ShutdownHook() {
        this.filePath = "backend/src/main/java/com/husksheets_api_server_scrumlords/serialize/publishers.ser";
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    /**
     * Serialize the publishers object on shutdown.
     * @throws IOException if an I/O error occurs
     * @author Kaan Tural
     */
    @PreDestroy
    public void onShutdown() throws IOException {
        System.out.println("ShutdownHook: Working Directory = " + System.getProperty("user.dir"));
        Path path = Paths.get(filePath).toAbsolutePath();
        System.out.println("Resolved path: " + path);

        Path parentDir = path.getParent();
        if (parentDir != null && !Files.exists(parentDir)) {
            Files.createDirectories(parentDir);
        }
        Publishers publishers = Publishers.getInstance();
        SerializationUtil.serialize(publishers, path.toString());
    }
}
