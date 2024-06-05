package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Publisher Class
 * author: Kaan Tural and Parnika Jain
 */
public class Publisher {
    @Getter
    private final String name;
    @Getter
    private List<Sheet> sheets;

    /**
     * Individual Publisher constructor.
     *
     * @param name the name of this publisher.
     */
    public Publisher(String name) {
        this.name = name;
        this.sheets = new ArrayList<>();
    }

    /**
     * Adds a sheet to this specific Publisher's list of sheets.
     *
     * @param sheet The sheet to be assigned to this Publisher.
     */
    public void addSheet(Sheet sheet) {
        sheets.add(sheet);
    }

    /**
     * Deletes a specific sheet matching the naming convention of the passed in sheet.
     *
     * @param sheetName Name of the sheet to delete.
     * @return boolean of if the deletion was successfully done, false if there was no matching sheet.
     */
    public boolean deleteSheet(String sheetName) {
        return sheets.removeIf(sheet -> sheet.getSheetName().equals(sheetName));
    }
}
