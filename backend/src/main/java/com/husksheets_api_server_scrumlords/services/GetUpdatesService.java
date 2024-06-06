package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Get updates service class
 * Author: Nicholas O'Sullivan
 */
@Service
public class GetUpdatesService {
    public enum UpdateType {
        SUBSCRIPTION,
        PUBLISHED
    }
    public Response getUpdates(String requestPublisher, String requestSheet, int id, UpdateType updateType) {
        Publishers publishers = Publishers.getInstance();
        Publisher publisher = publishers.getPublisher(requestPublisher);
        if (publisher == null) {
            return new Response(false, "Publisher not found: " + requestPublisher);
        }
        Sheet userSheet = publisher.getSheets().stream()
                .filter(s -> requestSheet.equals(s.getSheetName())).findAny().orElse(null);
        if (userSheet == null) {
            return new Response(false, "Sheet not found:" + requestPublisher +
                    "/" + requestSheet);
        } else {
            String payload = "";
            if (updateType == UpdateType.SUBSCRIPTION) {
                payload = userSheet.getUpdatesForSubscriptionAfterGivenID(id);
            } else if (updateType == UpdateType.PUBLISHED) {
                payload = userSheet.getUpdatesForPublishedAfterGivenID(id);
            }
            Value returnValue = new Value(requestPublisher, requestSheet, userSheet.getLatestUpdateID(), payload);
            List<Value> returnValues = new ArrayList<>();
            returnValues.add(returnValue);
            Response returnResponse = new Response(true, null);
            returnResponse.setValues(returnValues);
            return returnResponse;
        }
    }
}


