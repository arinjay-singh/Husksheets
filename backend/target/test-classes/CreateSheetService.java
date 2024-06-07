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

    /**
     * Create a sheet for a publisher with the given sheet name if it does not already exist.
     *
     * @param publisher the publisher to create the sheet for.
     * @param requestSheet the name of the sheet to create.
     * @return A response to show the action has been done successfully or information if not.
     */
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
