package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Sheet;
import com.husksheets_api_server_scrumlords.requests.CreateSheetRequest;
import org.springframework.stereotype.Service;


/**
 * Create Sheet Service class:
 * author : Kaan Tural, Nicholas O'Sullivan
 */
@Service
public class CreateSheetService {

    public Response createSheet(Publisher publisher, String requestSheet) {
        boolean sheetExists = publisher.getSheets().stream()
                .anyMatch(sheet -> sheet.getSheetName().equals(requestSheet));
        if (sheetExists) {
            return new Response(false, String.format("Sheet already exists: %s", requestSheet));
        }

        Sheet sheet = new Sheet(requestSheet, publisher.getName());
        publisher.addSheet(sheet);

        return new Response(true, null);

    }


}
