package com.husksheets_api_server_scrumlords.requests;

import lombok.Getter;
import lombok.Setter;

/**
 * DeleteSheetRequest class: The format of a Request to delete a specific sheet from a publisher.
 * @author Kaan Tural
 */
public class DeleteSheetRequest extends AbstractPublisherRequest {
    @Getter
    @Setter
    private String sheet;
}
