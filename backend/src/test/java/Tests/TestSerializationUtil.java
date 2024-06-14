package Tests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.times;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Sheet;
import com.husksheets_api_server_scrumlords.serialize.SerializationUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Test SerializationUtil class for serialization and deserialization of data
 * @author Kaan Tural
 */
public class TestSerializationUtil {
    @TempDir
    Path tempDir;
    private static final String TEST_FILE_PATH = "src/test/java/Tests/test_publishers.ser";
    private static final String TEST_FILE_PATH2 =
            "backend/src/main/java/com/husksheets_api_server_scrumlords/serialize/test_publishers.ser";


    @BeforeEach
    public void setUp() {
        File directory = new File("src/test/java/Tests");
        if (!directory.exists()) {
            directory.mkdirs();
        }
        // Clear the test file before each test
        SerializationUtil.clearSerializedData(TEST_FILE_PATH);
    }

    @AfterEach
    public void tearDown() {
        // Clear the test file after each test
        SerializationUtil.clearSerializedData(TEST_FILE_PATH);
    }

    @Test
    public void testSerializationAndDeserialization() throws IOException {
        // Create and populate the Publishers singleton
        Publishers publishers = Publishers.getInstance();
        publishers.addNewPublisher("testUser1");
        Publisher testPublisher1 = publishers.getPublisher("testUser1");
        testPublisher1.addSheet(new Sheet("Sheet1", "testUser1"));

        // Serialize the Publishers singleton
        SerializationUtil.serialize(publishers, TEST_FILE_PATH);
        File file = new File(TEST_FILE_PATH);
        assertTrue(file.exists(), "Serialized file should be created");

        // Clear the current instance for testing deserialization
        publishers.getPublisherMap().clear();

        // Deserialize the Publishers singleton
        Publishers deserializedPublishers = (Publishers) SerializationUtil.deserialize(TEST_FILE_PATH);
        assertNotNull(deserializedPublishers, "Deserialized object should not be null");

        // Verify the deserialized data
        assertTrue(deserializedPublishers.getPublisherMap().containsKey("testUser1"), "Deserialized publisher should contain testUser1");
        Publisher deserializedPublisher1 = deserializedPublishers.getPublisher("testUser1");
        assertNotNull(deserializedPublisher1, "Deserialized publisher testUser1 should not be null");
        assertEquals(1, deserializedPublisher1.getSheets().size(),
                "Deserialized publisher should have 1 sheet");
        assertEquals("Sheet1", deserializedPublisher1.getSheets().get(0).getSheetName(),
                "Deserialized sheet name should be 'Sheet1'");
    }

    @Test
    public void testSerializationException() {
        // Simulate serialization exception by providing a directory path instead of a file path
        String invalidPath = tempDir.toString();
        Publishers publishers = Publishers.getInstance();

        try (MockedStatic<Files> mockedFiles = mockStatic(Files.class)) {
            mockedFiles.when(() -> Files.exists(Mockito.any())).thenReturn(false);
            mockedFiles.when(() -> Files.createDirectories(Mockito.any()))
                    .thenThrow(new IOException("Mocked IOException"));

            assertThrows(IOException.class, () -> SerializationUtil.serialize(publishers, invalidPath),
                    "Expected IOException to be thrown");

            mockedFiles.verify(() -> Files.createDirectories(Mockito.any()), times(1));
        }
    }

    @Test
    public void testDeserializationException() {
        // Simulate deserialization exception by providing a non-existent file
        String nonExistentFilePath = "src/test/java/Tests/non_existent_file.ser";
        Object result = SerializationUtil.deserialize(nonExistentFilePath);
        assertNull(result, "Expected null to be returned on deserialization failure");
    }

    @Test
    public void testSerializationDeserialization() throws IOException {
        Publishers publishers = Publishers.getInstance();
        publishers.addNewPublisher("testUser");

        SerializationUtil.serialize(publishers, TEST_FILE_PATH2);

        File file = new File(TEST_FILE_PATH2);
        assertTrue(file.exists(), "Serialized file should be created");

        Publishers deserializedPublishers = (Publishers) SerializationUtil.deserialize(TEST_FILE_PATH2);
        assertNotNull(deserializedPublishers, "Deserialized object should not be null");
        assertTrue(deserializedPublishers.getPublisherMap().containsKey("testUser"),
                "Deserialized publisher should contain testUser");
    }
}