package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

/**
 * Value class constructor
 * @author Kaan Tural, Parnika Jain
 */
public class Value {
    @Getter
    String publisher;
    @Getter
    String sheet;
    @Getter
    Integer id;
    @Getter
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

    /**
     * override equals for testing
     * @author Kaan Tural
     * @param obj compared to :
     * @return bool
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;

        Value value = (Value) obj;
        if (!Objects.equals(publisher, value.publisher)) return false;
        if (!Objects.equals(sheet, value.sheet)) return false;
        if (!Objects.equals(id, value.id)) return false;
        return Objects.equals(payload, value.payload);
    }
}
