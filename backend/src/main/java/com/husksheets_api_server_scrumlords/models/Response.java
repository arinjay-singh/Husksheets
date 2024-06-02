package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

public class Response {

    @Getter
    @Setter
    boolean success;

    @Getter
    @Setter
    String message;

    @Getter
    @Setter
    ArrayList<Value> values;

    @Getter
    @Setter
    Long time;

    public Response() {
        this.success = false;
        this.message = null;
        this.values = values;
        this.time = System.currentTimeMillis();
    }

    @Override
    public String toString() {
        return String.format("""
                {
                    "success":"%b,"
                    "message":"%s",
                    "value":"%s""
                    "time":"%s"
                }""",
                success, message, values, time);
    }

    public boolean equals(Response otherResponse) {
        return (this.success == otherResponse.success) &&
                (this.message.equals(otherResponse.message)) &&
                (this.values.equals(otherResponse.values));
    }
}