package com.husksheets_api_server_scrumlords.repositories;

import com.husksheets_api_server_scrumlords.models.Publisher;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublisherRepository extends CrudRepository<Publisher, long> {
    Publisher findByUsername(String username);
}
