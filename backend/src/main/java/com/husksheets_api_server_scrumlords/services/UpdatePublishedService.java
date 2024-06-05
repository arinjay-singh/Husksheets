package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Sheet;
import org.springframework.stereotype.Service;

/**
 * Update Published Service class
 * Authors: Nicholas O'Sullivan, Parnika Jain
 */
@Service
public class UpdatePublishedService {

    public Response updatePublished(String username, String requestPublisher, String requestSheet, String requestPayload) {
        Publishers publishers = Publishers.getInstance();
        Publisher publisher = publishers.getPublisher(username);
        if (publisher == null) {
            return new Response(false, "Not found:" + requestPublisher +
                    "/" + requestSheet);
        }
        Sheet userSheet = publisher.getSheets().stream()
                .filter(s -> requestSheet.equals(s.getSheetName())).findAny().orElse(null);
        if (userSheet == null) {
            return new Response(false, "Not found:" + requestPublisher +
                    "/" + requestSheet);
        } else {
            //userSheet.addPublisherUpdate();
           // userSheet.setPayload(requestPayload);
            return new Response(true, null);
        }
    }
}
