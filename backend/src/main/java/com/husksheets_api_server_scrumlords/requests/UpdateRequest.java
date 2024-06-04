package com.husksheets_api_server_scrumlords.requests;

import lombok.Getter;
import lombok.Setter;
/*
Update request
author: Parnika Jain
 */
public class UpdateRequest extends AbstractPublisherRequest {
    @Getter
    @Setter
    private String sheet;

    @Getter
    @Setter
    private String payload;
}
