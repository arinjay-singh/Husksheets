package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Sheet Class
 * author: Kaan Tural
 */
public class Sheet {
    @Getter
    @Setter
    private String sheet;

    @Getter
    @Setter
    private String payload;

    @Getter
    private final String publisherName;

    /**
     * Constructor for a single instance of a sheet.
     *
     * @param name Name of the given sheet.
     * @param publisherName Name of the publisher for this sheet.
     */
    public Sheet(String name, String publisherName) {
        this.sheet = name;
        this.payload = "";
        this.publisherName = publisherName;
    }
}
