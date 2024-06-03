package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

public class Response {

    @Getter
    boolean success;

    @Getter
    String message;

    @Getter
    @Setter
    List<Value> values;

    @Getter
    Long time;

    public Response(Boolean success, String message) {
        this.success = success;
        this.message = message;
        this.values = new ArrayList<>();
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