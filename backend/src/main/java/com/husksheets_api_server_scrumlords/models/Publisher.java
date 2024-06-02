package com.husksheets_api_server_scrumlords.models;

public class Publisher {
    private String name;
    //future need to have list of spreadsheet Id's

    public Publisher(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
