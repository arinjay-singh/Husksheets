package com.husksheets_api_server_scrumlords.requests;

import lombok.Getter;
import lombok.Setter;

/**
 * CreateSheetRequest class: The format of a Request to create a sheet for a publisher with the given sheet name.
 * @author Kaan Tural
 */
public class CreateSheetRequest extends AbstractPublisherRequest {
    @Getter
    @Setter
    private String sheet;
}
