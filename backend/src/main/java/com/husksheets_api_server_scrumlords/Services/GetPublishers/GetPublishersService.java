/*
Core: GetPublishers interface
Author: Nicholas O'Sullivan
 */

package com.husksheets_api_server_scrumlords.Services.GetPublishers;

interface GetPublishersService {
   //no arg passed, only body:{
    //    "publisher": "alice"
    //}
    public void getPublishers();
        //process request
        //getPublishersFromDB
        //returnRequest

    public boolean getPublishersFromStorage();
        //connect to db
        //cycle through each user_id and get:
            //usernames

    public boolean returnGetPublishersRequest();
            //return message in format
            //"publisher": "username",
            //            "sheet": null,
            //            "id": null,
            //            "payload": null






}