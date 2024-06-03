package com.husksheets_api_server_scrumlords.requests;

import lombok.Getter;
import lombok.Setter;

public class DeleteSheetRequest extends AbstractPublisherRequest {

    @Getter
    @Setter
    private String sheet;
}
