package com.husksheets_api_server_scrumlords.controllers;
import com.husksheets_api_server_scrumlords.services.GetPublishersService;
import com.husksheets_api_server_scrumlords.services.RegisterUserService;
import com.husksheets_api_server_scrumlords.models.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


/**
Register, GetPublishers APIs
 */
@RestController
public class RegisterController {
    private final RegisterUserService registerUserService; //inject service into controller.
    private final GetPublishersService getPublishersService;


    /**
     * Constructor for a RegisterController.
     * @author Nicholas O'Sullivan
     * @param registerUserService the current instance of RegisterUserServices which has helper methods
     *                           for the controller.
     */
    public RegisterController(RegisterUserService registerUserService, GetPublishersService getPublishersService) {
        this.registerUserService = registerUserService;
        this.getPublishersService = getPublishersService;
    }

    /**
     * Verifies a user as a registered Publisher, and allows them to edit sheets.
     * @author Nicholas O'Sullivan
     * @return A simple Response of true to successfully registering.
     */
    @GetMapping("api/v1/register")
    public Response register() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username =  authentication.getName();
        return registerUserService.register(username);
    }

    /**
     * Mapping to the getPublishers route, gets a list of currently registered publishers.
     * @author Kaan Tural
     * @return A Response formatted with the names of publishers to the API caller.
     */
    @GetMapping("api/v1/getPublishers")
    public Response getPublishers() {
        return getPublishersService.getPublishers();
    }
}