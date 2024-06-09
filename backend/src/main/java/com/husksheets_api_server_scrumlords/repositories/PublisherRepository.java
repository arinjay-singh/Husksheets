package com.husksheets_api_server_scrumlords.repositories;

import com.husksheets_api_server_scrumlords.models.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

//public interface PublisherRepository extends JpaRepository<Publisher, String> {
//
//    @Query("""
//            SELECT p from Publisher WHERE p.name = ?1""")
//    Optional<Publisher> getPublisherByName(String name);
//}
