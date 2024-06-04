package com.husksheets_api_server_scrumlords.requests;

import lombok.Getter;
import lombok.Setter;

/**
 * UpdatePublishedRequest abstract class: The general format of a Request to the server dealing with sheets.
 * Author: Kaan Tural
 */
public abstract class AbstractPublisherRequest {
    @Getter
    @Setter
    private String publisher;
}
