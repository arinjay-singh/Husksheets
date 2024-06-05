package com.husksheets_api_server_scrumlords.controllers;
import com.husksheets_api_server_scrumlords.Helpers.RegisterUserService;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.stream.Collectors;


/*
Register API
author: nicholas o'sullivan and Kaan Tural
 */
@RestController
public class RegisterController {
    private final RegisterUserService registerUserService; //inject service into controller.

    /**
     * Constructor for a RegisterController.
     *
     * @param registerUserService the current instance of RegisterUserServices which has helper methods
     *                           for the controller.
     */
    public RegisterController(RegisterUserService registerUserService) {
        this.registerUserService = registerUserService;
    }

    /**
     * Verifies a user as a registered Publisher, and allows them to edit sheets.
     *
     * @return A simple Response of true to successfully registering.
     */
    @GetMapping("api/v1/register")
    public Response register() {
        //get auth token to access client username
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username =  authentication.getName();
        //get and send response from reg service
        return registerUserService.register(username);
    }

    /**
     * Mapping to the getPublishers route, gets a list of currently registered publishers.
     *
     * @return A Response formatted with the names of publishers to the API caller.
     */
    @GetMapping("api/v1/getPublishers")
    public Response getPublishers() {
        Publishers publishers = Publishers.getInstance();
        ArrayList<String> allPublishers = new ArrayList<>(publishers.getPublisherMap().keySet());
        System.out.println("All publishers: " + allPublishers);

        ArrayList<Value> values = (ArrayList<Value>) allPublishers.stream()
                .map(publisher -> new Value(publisher, null, null, null))
                .collect(Collectors.toList());

        Response response = new Response(true, null);
        response.setValues(values);
        return response;
    }
}
