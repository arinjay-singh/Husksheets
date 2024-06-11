package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Sheet;
import com.husksheets_api_server_scrumlords.models.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Get Sheets Service class
 * @author Main functionality: Kaan Tural
 * @author Refactor into an injected service: Nicholas O'Sullivan
 */
@Service
public class GetSheetsService {

    /**
     * Get all sheets for the given publisher.
     *
     * @param publisher the publisher to get the sheets for.
     * @return A response with all sheets for the publisher.
     */
    public Response getSheets(Publisher publisher) {
        List<Value> values = publisher.getSheets().stream()
                .map(sheet -> new Value(sheet.getPublisherName(), sheet.getSheetName(), null, null))
                .toList();
        for (Sheet sheet : publisher.getSheets()) {
            System.out.println(sheet.getSheetName());
        }
        Response response = new Response(true, null);
        response.setValues(values);
        return response;
    }
}
