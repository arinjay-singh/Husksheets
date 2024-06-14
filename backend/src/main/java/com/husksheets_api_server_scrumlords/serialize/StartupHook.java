package com.husksheets_api_server_scrumlords.serialize;

import javax.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import com.husksheets_api_server_scrumlords.models.Publishers;

import java.io.File;

/**
 * StartupHook class: Deserialize the data from the file on startup if it exists.
 * If the file does not exist, start with a fresh state.
 * @author Kaan Tural
 */
@Component
public class StartupHook {
    private static final String FILE_PATH =
            "backend/src/main/java/com/husksheets_api_server_scrumlords/serialize/publishers.ser";

    /**
     * Deserialize the data from the file on startup if it exists.
     * If the file does not exist, start with a fresh state.
     * @author Kaan Tural
     */
    @PostConstruct
    public void onStartup() {
        File file = new File(FILE_PATH);
        if (file.exists()) {
            Publishers deserializedPublishers = (Publishers) SerializationUtil.deserialize(FILE_PATH);
            if (deserializedPublishers != null) {
                Publishers.getInstance().getPublisherMap().putAll(deserializedPublishers.getPublisherMap());
            }
        } else {
            System.out.println("No serialized data file found. Starting with a fresh state.");
        }
    }
}
