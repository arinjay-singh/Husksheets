package com.husksheets_api_server_scrumlords.controllers;

import com.husksheets_api_server_scrumlords.models.*;
import com.husksheets_api_server_scrumlords.requests.UpdatePublishedRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UpdateController {

    private final Publishers publishers;

    public UpdateController() {
        this.publishers = Publishers.getInstance();
    }

    @PostMapping("api/v1/updatePublished")
    public Response updateSheet(@RequestBody UpdatePublishedRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Publisher publisher = publishers.getPublisher(username);
        Sheet userSheet = publisher.getSheets().stream()
                .filter(s -> request.getSheet().equals(s.getSheet())).findAny().orElse(null);
        if (!username.equals(request.getPublisher())) {
            return new Response(false, "Unauthorized: sender is not owner of sheet");
        }
        //boolean sheetExists = publisher.getSheets().stream().allMatch(sheet -> sheet.getSheet().equals(request.getSheet()));
        if (userSheet == null) {
            return new Response(false, "Not found:" + request.getPublisher() +
                    "/" + request.getSheet());
        }
        else {
            userSheet.setPayload(request.getPayload());
            return new Response(true, null);
        }
    }


}
