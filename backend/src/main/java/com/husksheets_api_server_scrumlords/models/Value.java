package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Response class
 * author: Kaan Tural and Parnika Jain
 */
public class Value {

    @Getter
    @Setter
    String publisher;

    @Getter
    @Setter
    String sheet;

    @Getter
    @Setter
    Integer id;

    @Getter
    @Setter
    String payload;

    /**
     * Constructor for values returned as a part of Response.
     *
     * @param publisher the publisher.
     * @param sheet the sheet being assigned to this value.
     * @param payload payload of the sheet.
     */
    public Value(String publisher, String sheet, String payload) {
        this.publisher = publisher;
        this.sheet = sheet;
        this.id = null;
        this.payload = payload;
    }
}
