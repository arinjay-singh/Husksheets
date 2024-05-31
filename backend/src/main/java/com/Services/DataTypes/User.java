/*
User class
Author: Nicholas O'Sullivan
 */
package com.Services.DataTypes;

import java.util.ArrayList;

public class User {
    private final String username;
    private final String password;
    private ArrayList<String> publishedSheets; //list of sheetID
    private ArrayList<String> subscribedSheets; //list of sheetID


    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.publishedSheets = new ArrayList<>();
        this.subscribedSheets = new ArrayList<>();
    }




    /*
     * Getters
     */
    public String getUsername() {
        return this.username;
    }

    public ArrayList<String> getPublishedSheets() {
        return this.publishedSheets;
    }

    public ArrayList<String> getSubscribedSheets() {
        return this.subscribedSheets;
    }

}