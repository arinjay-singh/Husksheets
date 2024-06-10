package com.husksheets_api_server_scrumlords.serialize;

import javax.annotation.PreDestroy;
import org.springframework.stereotype.Component;
import com.husksheets_api_server_scrumlords.models.Publishers;

@Component
public class ShutdownHook {
    private static final String FILE_PATH = "backend/src/main/java/com/husksheets_api_server_scrumlords/serialize/publishers.ser";

    @PreDestroy
    public void onShutdown() {
        Publishers publishers = Publishers.getInstance();
        SerializationUtil.serialize(publishers, FILE_PATH);
    }
}
