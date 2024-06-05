package com.husksheets_api_server_scrumlords.requests;

import lombok.Getter;
import lombok.Setter;

public class GetUpdatesRequest extends AbstractPublisherRequest{
    @Getter
    @Setter
    private String sheet;

    @Getter
    @Setter
    private String id;
}