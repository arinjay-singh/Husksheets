package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Sheet Class
 * author: Kaan Tural
 */
public class Sheet {
    @Getter
    @Setter
    private String sheetName;
    @Getter
    private final String publisherName;
    @Getter
    private List<Value> publisherUpdates;
    @Getter
    private List<Value> subscriberUpdates;


    /**
     * Constructor for a single instance of a sheet.
     *
     * @param name Name of the given sheet.
     * @param publisherName Name of the publisher for this sheet.
     */
    public Sheet(String name, String publisherName) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Sheet name cannot be null or empty");
        }
        if (publisherName == null || publisherName.isEmpty()) {
            throw new IllegalArgumentException("Publisher name cannot be null or empty");
        }
        this.sheetName = name;
        this.publisherName = publisherName;
        this.publisherUpdates = new ArrayList<>();
        this.subscriberUpdates = new ArrayList<>();
        System.out.println("Created sheet with name: " + name + " and publisher: " + publisherName);
    }

    public void addPublisherUpdate(Value value) {
        publisherUpdates.add(value);
    }
    public void addSubscriberUpdate(Value value) {
        subscriberUpdates.add(value);
    }
}
