/**
 * Publishers class
 * author: nicholas o'sullivan
 */
package com.husksheets_api_server_scrumlords.models;
import lombok.Getter;

import java.util.HashMap;

public class Publishers
{
    @Getter
    private HashMap<String, Publisher> publisherMap; //map username -> Publisher Class
    private Publishers() {
        publisherMap = new HashMap<>();
    }

    //singleton "Publishers" instance
    private static final class InstanceHolder {
        private static final Publishers instance = new Publishers();
    }
    public static Publishers getInstance() {
        return Publishers.InstanceHolder.instance;
    }

    /*
    Function: addNewPublisher
    Add new user, ensure no existing user w/ username exists.
    Return false if username conflict.
     */
    public boolean addNewPublisher(String username) {
        if (publisherMap.containsKey(username)) {
            return false; //if user already registered, do nothing
        }
        else {
            Publisher publisher = new Publisher(username, null); //create a new publisher for the user
            publisherMap.put(username, publisher);  //enter into publisherMap
            return true;
        }
    }
    /*
    Function: addNewPublisher
    Get a publisher by name, returns Null if user not found.
     */
    public Publisher getPublisher(String username) {
        return publisherMap.get(username);
    }

}
