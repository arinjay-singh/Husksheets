package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Sheet Class
 * author: Nicholas O'Sullivan Kaan Tural
 */
public class Sheet {
    @Getter
    @Setter
    private String sheetName;
    @Getter
    private final String publisherName;
    @Getter
    private List<String> updatesForSubscription;
    @Getter
    private List<String> updatesForPublished;



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
        this.updatesForSubscription = new ArrayList<>();
        this.updatesForPublished = new ArrayList<>();
        System.out.println("Created sheet with name: " + name + " and publisher: " + publisherName);
    }

    public void addNewUpdateSubscription(String update) {
        updatesForSubscription.add(update);
    }
    public void addNewUpdatePublished(String update) {
        updatesForPublished.add(update);
    }

    public int getLatestUpdateID() {
        return updatesForSubscription.size();
    }

    public String getUpdatesForSubscriptionAfterGivenID(int id) {
        return getUpdates(id, updatesForSubscription);
    }

    public String getUpdatesForPublishedAfterGivenID(int id) {
        return getUpdates(id, updatesForPublished);
    }

    private String getUpdates(int id, List<String> updates) {
        StringBuilder concatenatedUpdates = new StringBuilder();
        if (id < updates.size()) {
            for (int i = updates.size() - 1; i >= id ; i--) {
                 concatenatedUpdates.append(updates.get(i)).append("\n");
            }
        }
        return concatenatedUpdates.toString();
    }
}
