package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

public class Sheet {
    @Getter
    @Setter
    private String sheet;

    @Getter
    @Setter
    private String payload;

    @Getter
    private final String publisherName;

    public Sheet(String name, String publisherName) {
        this.sheet = name;
        this.payload = "";
        this.publisherName = publisherName;
    }
}
