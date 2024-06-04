package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

/**
 * Value class
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
     * @param id the id of the updates.
     * @param payload payload of the sheet.
     */
    public Value(String publisher, String sheet, Integer id, String payload) {
        this.publisher = publisher;
        this.sheet = sheet;
        this.id = id;
        this.payload = payload;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof Value)) {
            return false;
        }
        Value value = (Value) obj;
        return value.getPublisher().equals(this.getPublisher()) &&
                value.getSheet().equals(this.getSheet()) &&
                value.getId().equals(this.getId()) &&
                value.getPayload().equals(this.getPayload());
    }
}
