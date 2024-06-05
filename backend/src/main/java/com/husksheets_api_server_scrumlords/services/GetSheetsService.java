package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Sheet;
import com.husksheets_api_server_scrumlords.models.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Get Sheets Service class
 * {@code @Author:} Kaan Tural, Nicholas O'Sullivan
 */
@Service
public class GetSheetsService {
    public Response getSheets(Publisher publisher) {
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
