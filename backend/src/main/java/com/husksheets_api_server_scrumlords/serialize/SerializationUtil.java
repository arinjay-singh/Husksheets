package com.husksheets_api_server_scrumlords.serialize;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * SerializationUtil class: Serialize and deserialize objects.
 * @author Kaan Tural
 */
public class SerializationUtil {
    /**
     * Serialize an object to a file.
     *
     * @param object the object to serialize
     * @param fileName the name of the file to serialize to.
     * @author Kaan Tural
     */
    public static void serialize(Object object, String fileName) throws IOException {
        Path path = Paths.get(fileName).toAbsolutePath();
        Path parentDir = path.getParent();
        if (parentDir != null && !Files.exists(parentDir)) {
            Files.createDirectories(parentDir);
        }
        try (FileOutputStream fileOutputStream = new FileOutputStream(path.toString());
             ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream)) {
            objectOutputStream.writeObject(object);
        }
    }

    /**
     * Deserialize an object from a file.
     *
     * @param filename the name of the file to deserialize from.
     * @return the deserialized object, or null if the deserialization failed.
     * @author Kaan Tural
     */
    public static Object deserialize(String filename) {
        Path path = Paths.get(filename).toAbsolutePath();
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(path.toString()))) {
            return ois.readObject();
        } catch (FileNotFoundException e) {
            System.err.println("File not found: " + filename);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Clear serialized data by deleting the file.
     *
     * @param filename the name of the file to clear the serialized data from.
     * @author Kaan Tural
     */
    public static void clearSerializedData(String filename) {
        Path path = Paths.get(filename).toAbsolutePath();
        File file = new File(path.toString());
        if (file.exists()) {
            file.delete();
        }
    }
}