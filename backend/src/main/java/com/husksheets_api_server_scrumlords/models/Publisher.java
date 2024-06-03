package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

public class Publisher {
    @Getter
    private final String name;
    @Getter
    private List<Sheet> sheets;

    public Publisher(String name) {
        this.name = name;
        this.sheets = new ArrayList<>();
    }

    public void addSheet(Sheet sheet) {
        sheets.add(sheet);
    }
    public boolean deleteSheet(String sheetName) {
        return sheets.removeIf(sheet -> sheet.getSheet().equals(sheetName));
    }
}
