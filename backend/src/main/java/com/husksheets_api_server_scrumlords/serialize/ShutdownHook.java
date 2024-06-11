package com.husksheets_api_server_scrumlords.serialize;

import javax.annotation.PreDestroy;
import org.springframework.stereotype.Component;
import com.husksheets_api_server_scrumlords.models.Publishers;

import java.io.IOException;

/**
 * ShutdownHook class: Serialize the publishers object on shutdown.
 * @author Kaan Tural
 */
@Component
public class ShutdownHook {
    private static final String FILE_PATH =
            "src/main/java/com/husksheets_api_server_scrumlords/serialize/publishers.ser";

    /**
     * Serialize the publishers object on shutdown.
     * @throws IOException if an I/O error occurs
     * @author Kaan Tural
     */
    @PreDestroy
    public void onShutdown() throws IOException {
        Publishers publishers = Publishers.getInstance();
        SerializationUtil.serialize(publishers, FILE_PATH);
    }
}
