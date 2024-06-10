package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Publisher Class constructor
 * author: Kaan Tural
 */
public class Publisher implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
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
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Publisher name cannot be null or empty");
        }
        this.name = name;
        this.sheets = new ArrayList<>();
    }

    /**
     * Adds a sheet to this specific Publisher's list of sheets.
     * @author Kaan tural
     * @param sheet The sheet to be assigned to this Publisher.
     */
    public void addSheet(Sheet sheet) {
        sheets.add(sheet);
    }

    /**
     * Deletes a specific sheet matching the naming convention of the passed in sheet.
     * @author Kaan Tural
     * @param sheetName Name of the sheet to delete.
     * @return boolean of if the deletion was successfully done, false if there was no matching sheet.
     */
    public boolean deleteSheet(String sheetName) {
        return sheets.removeIf(sheet -> sheet.getSheetName().equals(sheetName));
    }

    /**
     * Checks if a specific sheet exists in this Publisher's list of sheets.
     * @author Nicholas O'Sullivan
     * @param sheetName Name of the sheet to check.
     * @return boolean true if the sheet exists, false otherwise.
     */
    public boolean hasSheet(String sheetName) {
        return sheets.stream().anyMatch(sheet -> sheet.getSheetName().equals(sheetName));
    }
}
