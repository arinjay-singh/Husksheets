package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Sheet;

import java.util.HashMap;
import java.util.Map;

/**
 * Validation Utils class
 */
public class ValidationUtils {

    /**
     * Helper method to validate the publisher and sheet, making sure both exist and are not null.
     * @author: Kaan Tural, Parnika Jaan
     * @param requestPublisher The publisher to validate.
     * @param requestSheet The sheet to validate.
     * @return A map with the sheet and response of the validation to allow for easy access to both.
     */
    public static Map<Sheet, Response> validatePublisherAndSheet(String requestPublisher, String requestSheet) {
        HashMap<Sheet, Response> responseMap = new HashMap<>();
        if (requestSheet == null){
            responseMap.put(null, new Response(false, "Sheet is null"));
            return responseMap;
        }
        if (requestPublisher == null){
            responseMap.put(null, new Response(false, "Publisher is null"));
            return responseMap;
        }
        Publishers publishers = Publishers.getInstance();
        Publisher publisher = publishers.getPublisher(requestPublisher);
        if (publisher == null) {
            responseMap.put(null, new Response(false, "Publisher not found: " + requestPublisher));
            return responseMap;
        }
        Sheet userSheet = publisher.getSheets().stream()
                .filter(s -> requestSheet.equals(s.getSheetName())).findAny().orElse(null);
        if (userSheet == null) {
            responseMap.put(null, new Response(false, "Sheet not found: " + requestPublisher +
                    "/" + requestSheet));
            return responseMap;
        }
        responseMap.put(userSheet, new Response(true, null));
        return responseMap;
    }

    /**
     * Validates the payload to make sure it isn't null.
     * @author: Kaan Tural
     * @param payload String of text to validate.
     * @return Response object with the result of the validation.
     */
    public static Response validatePayload(String payload) {
        if (payload == null) {
            return new Response(false, "Payload is null");
        }
        return new Response(true, null);
    }

    /**
     * Validates the ID to make sure it isn't null.
     * @author: Kaan Tural
     * @param id Integer to validate.
     * @return Response object with the result of the validation.
     */
    public static Response validateId(String id) {
        if (id == null || id.equalsIgnoreCase("null")) {
            return new Response(false, "ID is null");
        }
        if(!id.matches("[0-9]+")){
            return new Response(false, "ID is not a number");
        }
        return new Response(true, null);
    }
}
