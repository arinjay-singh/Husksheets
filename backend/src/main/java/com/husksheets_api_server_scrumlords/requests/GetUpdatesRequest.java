package com.husksheets_api_server_scrumlords.requests;

import lombok.Getter;
import lombok.Setter;

/**
 * GetUpdatesRequest class: The format of a Request to get all updates for a specific sheet.
 * @author Parnika Jain
 */
public class GetUpdatesRequest extends AbstractPublisherRequest{
    @Getter
    @Setter
    private String sheet;

    @Getter
    @Setter
    private String id;
}
