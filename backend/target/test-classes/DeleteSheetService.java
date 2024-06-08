package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Response;
import org.springframework.stereotype.Service;


/**
 * Delete Sheet service
 *
 * Authors: Kaan Tural, Nicholas O'Sullivan
 */
@Service
public class DeleteSheetService {
    public Response deleteSheet(Publisher publisher, String sheet) {
        boolean success = publisher.deleteSheet(sheet);
        if (!success) {
            return new Response(false, String.format("Sheet does not exist: %s", sheet));
        }

        return new Response(true, null);
    }
}
