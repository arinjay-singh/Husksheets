/*
Core: CreateSheet interface
Author: Nicholas O'Sullivan
 */
package com.husksheets_api_server_scrumlords.Services.CreateSheet;

public interface CreateSheetService {
    //json passed argument w/ spreadsheet body
    //return json valid:
    //return json error: {"success":false,"message":"Sheet is nullUnauthorized: sender is not owner of sheet","value":[],"time":1716903138329}
    public void createSheet();
        //parseSheetRequest
        //readSheet
            //registerSheetInDB
        //returnMessage
    public boolean parseSheetRequest();
    //read JSON, strip each section to pass to helpers:
        //publisher
        //spreadsheet
            // spreadsheet_data

    public boolean readSheet();
        //read through JSON spreadsheet_data






}