package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;
/*
Update sheet APIs
author: Kaan Tural, Parnika Jain
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

    public Value(String publisher, String sheet, Integer id, String payload) {
        this.publisher = publisher;
        this.sheet = sheet;
        this.id = id;
        this.payload = payload;
    }
}
