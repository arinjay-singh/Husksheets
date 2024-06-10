package com.husksheets_api_server_scrumlords.models;
import lombok.Getter;

import java.util.HashMap;

/**
 * Publishers class constructor
 * @author nicholas o'sullivan
 */
public class Publishers {
    @Getter
    private HashMap<String, Publisher> publisherMap; //map username -> Publisher Class
    private Publishers() {
        publisherMap = new HashMap<>();
    }

    /**
     * Singleton pattern for publishers
     * @author Nicholas O'Sullivan
     */
    private static final class InstanceHolder {
        private static final Publishers instance = new Publishers();
    }
    public static Publishers getInstance() {
        return Publishers.InstanceHolder.instance;
    }

    /**
     * Adds a new publisher with the given username to the publisherMap if they don't already exist.
     * @author Nicholas O'Sullivan
     * @param username The username of the new publisher.
     */
    public void addNewPublisher(String username) {
        if (!publisherMap.containsKey(username)) {
            Publisher publisher = new Publisher(username);
            publisherMap.put(username, publisher);
        }
    }

    /**
     * Gets the instance of the publisher associated with the given username.
     * @author Nicholas O'Sullivan
     * @param username name of the publisher to get.
     * @return Publisher instance associated with the given username.
     */
    public Publisher getPublisher(String username) {
        return publisherMap.get(username);
    }
}
