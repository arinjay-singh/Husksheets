package com.husksheets_api_server_scrumlords.serialize;

import java.io.*;

/**
 * SerializationUtil class: Serialize and deserialize objects.
 * Author: Kaan Tural
 */
public class SerializationUtil {
    /**
     * Serialize an object to a file.
     *
     * @param object the object to serialize
     * @param filename the name of the file to serialize to.
     * @author Kaan Tural
     */
    public static void serialize(Object object, String filename) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filename))) {
            oos.writeObject(object);
        } catch (IOException e) {
            e.printStackTrace();
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
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(filename))) {
            return ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Clear serialized data by deleting the file.
     *
     * @param filename the name of the file to clear the serialized data from.
     */
    public static void clearSerializedData(String filename) {
        File file = new File(filename);
        if (file.exists()) {
            file.delete();
        }
    }
}
