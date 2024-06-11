package Tests;

import com.husksheets_api_server_scrumlords.HusksheetsApiServerScrumlordsApplication;
import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Sheet;
import com.husksheets_api_server_scrumlords.serialize.SerializationUtil;
import com.husksheets_api_server_scrumlords.serialize.ShutdownHook;
import com.husksheets_api_server_scrumlords.serialize.StartupHook;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.File;
import java.io.IOException;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Test the application lifecycle hooks for data persistence.
 * @author Kaan Tural
 */
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = HusksheetsApiServerScrumlordsApplication.class)
public class TestApplicationLifecycle {
    private static final String TEST_FILE_PATH =
            "src/main/java/com/husksheets_api_server_scrumlords/serialize/publishers.ser";

    @Autowired
    private StartupHook startupHook;

    @Autowired
    private ShutdownHook shutdownHook;

    @BeforeEach
    public void setUp() {
        Publishers.getInstance().getPublisherMap().clear();
        SerializationUtil.clearSerializedData(TEST_FILE_PATH);
    }

    @AfterEach
    public void tearDown() {
        SerializationUtil.clearSerializedData(TEST_FILE_PATH);
    }

    @Test
    public void testStartupHook() throws IOException {
        Publishers publishers = Publishers.getInstance();
        publishers.addNewPublisher("testUser1");
        Publisher testPublisher1 = publishers.getPublisher("testUser1");
        testPublisher1.addSheet(new Sheet("Sheet1", "testUser1"));

        shutdownHook.onShutdown();

        SerializationUtil.serialize(publishers, TEST_FILE_PATH);

        startupHook.onStartup();

        assertTrue(publishers.getPublisherMap().containsKey("testUser1"),
                "Deserialized publisher should contain testUser1");
        Publisher deserializedPublisher1 = publishers.getPublisher("testUser1");
        assertNotNull(deserializedPublisher1, "Deserialized publisher testUser1 should not be null");
        assertEquals(1, deserializedPublisher1.getSheets().size(),
                "Deserialized publisher should have 1 sheet");
        assertEquals("Sheet1", deserializedPublisher1.getSheets().get(0).getSheetName(),
                "Deserialized sheet name should be 'Sheet1'");
    }

    @Test
    public void testShutdownHook() throws IOException {
        Publishers publishers = Publishers.getInstance();
        publishers.addNewPublisher("testUser1");
        Publisher testPublisher1 = publishers.getPublisher("testUser1");
        testPublisher1.addSheet(new Sheet("Sheet1", "testUser1"));

        shutdownHook.onShutdown();

        File file = new File(TEST_FILE_PATH);
        assertTrue(file.exists(), "Serialized file should be created by shutdown hook");

        publishers.getPublisherMap().clear();

        Publishers deserializedPublishers = (Publishers) SerializationUtil.deserialize(TEST_FILE_PATH);
        assertNotNull(deserializedPublishers, "Deserialized object should not be null");

        assertTrue(deserializedPublishers.getPublisherMap().containsKey("testUser1"),
                "Deserialized publisher should contain testUser1");
        Publisher deserializedPublisher1 = deserializedPublishers.getPublisher("testUser1");
        assertNotNull(deserializedPublisher1, "Deserialized publisher testUser1 should not be null");
        assertEquals(1, deserializedPublisher1.getSheets().size(),
                "Deserialized publisher should have 1 sheet");
        assertEquals("Sheet1", deserializedPublisher1.getSheets().get(0).getSheetName(),
                "Deserialized sheet name should be 'Sheet1'");
    }
}