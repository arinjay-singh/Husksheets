package com.husksheets_api_server_scrumlords.controllers;

import com.husksheets_api_server_scrumlords.models.*;
import com.husksheets_api_server_scrumlords.requests.CreateSheetRequest;
import com.husksheets_api_server_scrumlords.requests.DeleteSheetRequest;
import com.husksheets_api_server_scrumlords.requests.GetSheetsRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
public class SheetController {
    private final Publishers publishers;

    public SheetController() {
        this.publishers = Publishers.getInstance();
    }

    @PostMapping("api/v1/createSheet")
    public Response createSheet(@RequestBody CreateSheetRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Publisher publisher = publishers.getPublisher(username);

        if (!username.equals(request.getPublisher()) || publisher == null) {
            return new Response(false, "Unauthorized: sender is not owner of sheet");
        }

        boolean sheetExists = publisher.getSheets().stream()
                .anyMatch(sheet -> sheet.getSheet().equals(request.getSheet()));
        if (sheetExists) {
            return new Response(false, String.format("Sheet already exists: %s", request.getSheet()));
        }

        Sheet sheet = new Sheet(request.getSheet(), request.getPublisher());
        publisher.addSheet(sheet);

        return new Response(true, null);
    }

    @PostMapping("api/v1/deleteSheet")
    public Response deleteSheet(@RequestBody DeleteSheetRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Publisher publisher = publishers.getPublisher(username);

        if (!username.equals(request.getPublisher()) || publisher == null) {
            return new Response(false, "Unauthorized: sender is not owner of sheet");
        }

        boolean success = publisher.deleteSheet(request.getSheet());

        if (!success) {
            return new Response(false, String.format("Sheet does not exist: %s", request.getSheet()));
        }

        return new Response(true, null);
    }

    @GetMapping("api/v1/getSheets")
    public Response getSheets(@RequestBody GetSheetsRequest request) {
        String publisherName = request.getPublisher();
        Publisher publisher = publishers.getPublisher(publisherName);
        if (publisher == null) {
            return new Response(false, String.format("Publisher not found: %s", publisherName));
        }

        List<Value> values = publisher.getSheets().stream()
                .map(sheet -> new Value(sheet.getPublisherName(), sheet.getSheet(), null, null))
                .toList();
        for (Sheet sheet : publisher.getSheets()) {
            System.out.println(sheet.getSheet());
        }

        Response response = new Response(true, null);
        response.setValues(values);
        return response;
    }
}
