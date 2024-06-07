/*
Register user service class
Author: Nicholas O'Sullivan
 */
package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import org.springframework.stereotype.Service;

/**
 * RegisterUserService class: Register a user as a publisher
 * author: Nicholas O'Sullivan
 */
@Service
public class RegisterUserService  {
    private final Publishers publishers = Publishers.getInstance();

    /**
     * Register a user as a publisher.
     *
     * @param username the username of the user to register
     * @return the successful Response object
     */
    public Response register(String username) {
        if (username != null && !username.isEmpty()) {
            addToPublishers(username);
        }
        return new Response(true, null);
    }

    /**
     * Add a new publisher to the list of publishers.
     *
     * @param username the username of the new publisher
     */
    public void addToPublishers(String username) {
        publishers.addNewPublisher(username);
        System.out.println(publishers.getPublisher(username).getName());
    }
}
