package com.husksheets_api_server_scrumlords.services;

import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.stream.Collectors;

/**
 * Get Publishers Service
 * author: @Kaan Tural, Nicholas O'Sullivan
 */
@Service
public class GetPublishersService {
        Publishers publishers = Publishers.getInstance();
        public Response getPublishers() {
            ArrayList<String> allPublishers = new ArrayList<>(this.publishers.getPublisherMap().keySet());
            System.out.println("All publishers: " + allPublishers);

            ArrayList<Value> values = (ArrayList<Value>) allPublishers.stream()
                    .map(publisher -> new Value(publisher, null, null, null))
                    .collect(Collectors.toList());

            Response response = new Response(true, null);
            response.setValues(values);
            return response;
        }

}
