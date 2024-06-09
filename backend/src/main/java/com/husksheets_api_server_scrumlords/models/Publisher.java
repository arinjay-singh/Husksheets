package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Publisher Class
 * author: Kaan Tural and Parnika Jain, Nicholas O'Sullivan
 */
@Entity
public class Publisher {
    @Getter
    @Id
    private final String name;

    @Getter
    @OneToMany(mappedBy = "publisher", cascade = CascadeType.ALL) //one to many relationship publisher->sheets
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

    /**
     * Checks if a specific sheet exists in this Publisher's list of sheets.
     *
     * @param sheetName Name of the sheet to check.
     * @return boolean true if the sheet exists, false otherwise.
     */
    public boolean hasSheet(String sheetName) {
        return sheets.stream().anyMatch(sheet -> sheet.getSheetName().equals(sheetName));
    }
}
