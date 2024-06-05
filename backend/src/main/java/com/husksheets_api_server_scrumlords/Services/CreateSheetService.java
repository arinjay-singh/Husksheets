package com.husksheets_api_server_scrumlords.Services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Sheet;
import com.husksheets_api_server_scrumlords.requests.CreateSheetRequest;
import org.springframework.stereotype.Service;

@Service
public class CreateSheetService {

    public Response createSheet(Publisher publisher, CreateSheetRequest request) {
        boolean sheetExists = publisher.getSheets().stream()
                .anyMatch(sheet -> sheet.getSheet().equals(request.getSheet()));
        if (sheetExists) {
            return new Response(false, String.format("Sheet already exists: %s", request.getSheet()));
        }

        Sheet sheet = new Sheet(request.getSheet(), request.getPublisher());
        publisher.addSheet(sheet);

        return new Response(true, null);

    }


}
