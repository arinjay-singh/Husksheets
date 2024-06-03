package com.husksheets_api_server_scrumlords.requests;

import lombok.Getter;
import lombok.Setter;

public abstract class AbstractPublisherRequest {
    @Getter
    @Setter
    private String publisher;
}
