package com.husksheets_api_server_scrumlords.requests;

import lombok.Getter;
import lombok.Setter;
/**
 * UpdateRequest class: The format of a Request to update a sheet with the given payload.
 * @author Parnika Jain
 */
public class UpdateRequest extends AbstractPublisherRequest {
    @Getter
    @Setter
    private String sheet;
    @Getter
    @Setter
    private String payload;
}
