package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Response;
import org.springframework.stereotype.Service;


/**
 * Delete Sheet service
 * @author Main functionality: Kaan Tural
 * @author Refactor into an injected service: Nicholas O'Sullivan
 */
@Service
public class DeleteSheetService {
    /**
     * Delete a sheet from a publisher if it exists.
     *
     * @param publisher the publisher to delete the sheet from.
     * @param sheet the name of the sheet to delete.
     * @return A response to show the action has been done successfully or information if not.
     */
    public Response deleteSheet(Publisher publisher, String sheet) {
        boolean success = publisher.deleteSheet(sheet);
        if (!success) {
            return new Response(false, String.format("Sheet does not exist: %s", sheet));
        }
        return new Response(true, null);
    }
}
