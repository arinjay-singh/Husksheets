package com.husksheets_api_server_scrumlords.controllers;

import com.husksheets_api_server_scrumlords.services.CreateSheetService;
import com.husksheets_api_server_scrumlords.services.DeleteSheetService;
import com.husksheets_api_server_scrumlords.services.GetSheetsService;
import com.husksheets_api_server_scrumlords.services.RegisterUserService;
import com.husksheets_api_server_scrumlords.models.*;
import com.husksheets_api_server_scrumlords.requests.AbstractPublisherRequest;
import com.husksheets_api_server_scrumlords.requests.CreateSheetRequest;
import com.husksheets_api_server_scrumlords.requests.DeleteSheetRequest;
import com.husksheets_api_server_scrumlords.requests.GetSheetsRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * SheetController Class
 * author: Kaan Tural, Nicholas O'Sullivan
 */
@RestController
public class SheetController {
    private final CreateSheetService createSheetService;
    private final DeleteSheetService deleteSheetService;
    private final GetSheetsService getSheetsService;
    private final Publishers publishers;
    public SheetController(CreateSheetService createSheetService, DeleteSheetService deleteSheetService,
                           GetSheetsService getSheetsService) {
        this.createSheetService = createSheetService;
        this.deleteSheetService = deleteSheetService;
        this.getSheetsService = getSheetsService;
        this.publishers = Publishers.getInstance();
    }

    /**
     * API route to create a sheet and assign it to the current publisher.
     *
     * @param request the body of the API call.
     * @return A response with the publisher and sheet being assigned to that publisher
     */
    @PostMapping("api/v1/createSheet")
    public Response createSheet(@RequestBody CreateSheetRequest request) {
        Publisher publisher = checkAuthentication(request, request.getSheet());
        if (publisher == null) {
            return errorResponseHelper(request, request.getSheet());
        }
        return createSheetService.createSheet(publisher, request.getSheet());
    }

    /**
     * API route to delete a sheet with the given name from the current publisher.
     *
     * @param request the body of the API call, containing the sheet to delete and publisher.
     * @return A response to show the action has been done successfully or information if not.
     */
    @PostMapping("api/v1/deleteSheet")
    public Response deleteSheet(@RequestBody DeleteSheetRequest request) {
        Publisher publisher = checkAuthentication(request, request.getSheet());
        if (publisher == null) {
            return errorResponseHelper(request, request.getSheet());
        }
        return deleteSheetService.deleteSheet(publisher, request.getSheet());
    }

    /**
     * API route to get all the sheets associated with publisher given in the call's body.
     *
     * @param request the body of the API call, containing the publisher to get sheets from.
     * @return A response with the sheets associated with the publisher or an error message.
     */
    @PostMapping("api/v1/getSheets")
    public Response getSheets(@RequestBody GetSheetsRequest request) {
        String publisherName = request.getPublisher();
        Publisher publisher = publishers.getPublisher(publisherName);
        if (publisher == null) {
            return new Response(false, String.format("Publisher not found: %s", publisherName));
        }
        return getSheetsService.getSheets(publisher);
    }

    /**
     * Helper function to check if the current request is a Publisher that exists and
     * is the one currently making the request.
     *
     * @param request the API call's body of the request.
     * @return the current instance of the publisher being dealt with or null if invalid.
     */
    public Publisher checkAuthentication(AbstractPublisherRequest request, String sheet) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Publisher publisher = publishers.getPublisher(username);
        if (!username.equals(request.getPublisher()) || publisher == null || sheet == null) {
            return null;
        } else {
            return publisher;
        }
    }

    /**
     * Helper function to return a response for different types of errors in the request.
     *
     * @param request the API call's body of the request.
     * @param sheet the sheet name to check if it exists.
     * @return a response with the error message.
     */
    public Response errorResponseHelper(AbstractPublisherRequest request, String sheet) {
        if (request.getPublisher() == null) {
            return new Response(false, "Publisher is null");
        } else if (sheet == null) {
            return new Response(false, "Sheet not found");
        } else {
            return new Response(false, "Unauthorized: sender is not owner of sheet");
        }
    }
}
