package com.husksheets_api_server_scrumlords.models;

import lombok.Getter;
import lombok.Setter;

public class Value {

   // @Getter
  //  @Setter
  //  Publisher publisher;

    @Getter
    @Setter
    String sheet;

    @Getter
    @Setter
    Integer id;

    @Getter
    @Setter
    String payload;

    public Value() {
       // this.publisher = publisher;
        this.sheet = null;
        this.id = null;
        this.payload = null;
    }
}