package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Get updates service class
 * @author main implementation: Nicholas O'Sullivan
 * @author null/empty validator: Kaan Tural
 */
@Service
public class GetUpdatesService {

    /**
     * Get updates for the given publisher and sheet with the given id and update type to determine access.
     *
     * @param requestPublisher the publisher to get the updates for.
     * @param requestSheet the sheet to get the updates for.
     * @param id the id to get the updates after.
     * @param updateType the type of update to get.
     * @return A response with the updates for the given publisher and sheet.
     */
    public Response getUpdates(String requestPublisher, String requestSheet, String id, UpdateType updateType) {
        Map<Sheet, Response> validationResponse = ValidationUtils.validatePublisherAndSheet(
                requestPublisher, requestSheet);
        if (validationResponse.containsKey(null)) {
            return validationResponse.get(null);
        }
        if (!ValidationUtils.validateId(id).isSuccess()) {
            return ValidationUtils.validateId(id);
        }
        int idInt = Integer.parseInt(id);
        Sheet userSheet = validationResponse.keySet().iterator().next();
        String payload = "";
        Value returnValue = new Value(requestPublisher, requestSheet, 0, "");
        if (updateType == UpdateType.SUBSCRIPTION) {
            payload = userSheet.getUpdatesForSubscriptionAfterGivenID(idInt);
            returnValue = new Value(requestPublisher, requestSheet, userSheet.getLatestUpdateID(), payload);
        } else if (updateType == UpdateType.PUBLISHED) {
            payload = userSheet.getUpdatesForPublishedAfterGivenID(idInt);
            returnValue = new Value(requestPublisher, requestSheet, userSheet.getLatestPublishedID(), payload);
        }
        ArrayList<Value> returnValues = new ArrayList<>();
        returnValues.add(returnValue);
        Response returnResponse = new Response(true, null);
        returnResponse.setValue(returnValues);
        return returnResponse;
    }

    public enum UpdateType {
        SUBSCRIPTION, PUBLISHED
    }
}


