package com.husksheets_api_server_scrumlords.Helpers;

import com.husksheets_api_server_scrumlords.models.Value;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class SharedDataStore {
    private static final Map<String, Value> publisherMap = new HashMap<>();

    public static void addPublisher(String username, Value value) {
        publisherMap.put(username, value);
    }

    public static Collection<Value> getAllPublishers() {
        return publisherMap.values();
    }

    public static void clear() {
        publisherMap.clear();
    }
}

