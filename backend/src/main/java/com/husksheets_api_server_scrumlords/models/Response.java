package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Response class
 * author: Kaan Tural Parnika Jain Nicholas O'Sullivan
 */
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

    /**
     * Constructor for Server response to requests.
     *
     * @param success Whether the API call was done properly
     * @param message Message if the API was called improperly
     */
    public Response(Boolean success, String message) {
        this.success = success;
        this.message = message;
        this.values = new ArrayList<>();
        this.time = System.currentTimeMillis();
    }

    /**
     * toString implementation to display response in proper formatting to user.
     *
     * @return Server Response formatted.
     */
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

    /**
     * Equals method to be able to test Responses making sure they are equivalent for our
     * implementation testing.
     *
     * @param obj The object to be compared to: thisResponse.equals(otherResponse)
     * @return Boolean of if the Responses are similar or not
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Response otherResponse = (Response) obj;
        return success == otherResponse.success &&
                (Objects.equals(message, otherResponse.message)) &&
                (Objects.equals(values, otherResponse.values)) &&
                otherResponse.time != null;
    }
}