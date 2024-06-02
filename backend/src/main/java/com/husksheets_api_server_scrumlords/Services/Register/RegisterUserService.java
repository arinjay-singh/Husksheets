/*
Register user service class
Author: Nicholas O'Sullivan
 */
package com.husksheets_api_server_scrumlords.Services.Register;

import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import org.springframework.stereotype.Service;

@Service
public class RegisterUserService  {

    //register user as a publisher, always return success.
    public Response register(String username) {
        addToPublishers(username);
        Response response =  new Response();
        response.setSuccess(true);
        return response;
    }


    /*
    register user in Publishers.
     */
    public void addToPublishers(String username) {
        Publishers publishers = Publishers.getInstance();
        publishers.addNewPublisher(username);
        System.out.println(publishers.getPublisher(username).getName());
    }

}
