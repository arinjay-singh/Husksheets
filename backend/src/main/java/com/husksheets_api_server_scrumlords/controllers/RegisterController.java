package com.husksheets_api_server_scrumlords.controllers;
//import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.Services.Register.RegisterUserService;
import com.husksheets_api_server_scrumlords.models.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


/*
Register API
author: nicholas o'sullivan
 */
@RestController
public class RegisterController {
    private final RegisterUserService registerUserService; //inject service into controller.
    public RegisterController(RegisterUserService registerUserService) {
        this.registerUserService = registerUserService;
    }

    @GetMapping("api/v1/register")
    public Response register() {
        //get auth token to access client username
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username =  authentication.getName();
        //get and send response from reg service
        return registerUserService.register(username);
    }


}
