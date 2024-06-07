package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.*;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Update Published Service class
 * Authors: Nicholas O'Sullivan, Parnika Jain
 */
@Service
public class UpdatePublishedService {

    /**
     * Update published for the given publisher and sheet with passed in payload.
     *
     * @param requestPublisher the publisher which owns the sheet we edit published for.
     * @param requestSheet the sheet to update the published for.
     * @param requestPayload the payload to update the published with.
     * @return A response with the result of the update.
     */
    public Response updatePublished(String requestPublisher, String requestSheet, String requestPayload) {
        Map<Sheet, Response> validationResponse = ValidationUtils.validatePublisherAndSheet(
                requestPublisher, requestSheet);
        if (validationResponse.containsKey(null)) {
            return validationResponse.get(null);
        }
        if (!ValidationUtils.validatePayload(requestPayload).isSuccess()) {
            return ValidationUtils.validatePayload(requestPayload);
        }
        Sheet userSheet = validationResponse.keySet().iterator().next();
        userSheet.addNewUpdateSubscription(requestPayload);
        return new Response(true, null);
    }
}
