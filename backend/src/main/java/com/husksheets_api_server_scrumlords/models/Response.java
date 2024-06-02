package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

public class Response {

    @Getter
    @Setter
    Boolean success;

    @Getter
    @Setter
    String message;

    @Getter
    @Setter
    ArrayList<Value> values;

    @Getter
    @Setter
    Long time;

    public Response(ArrayList<Value> values) {
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
}