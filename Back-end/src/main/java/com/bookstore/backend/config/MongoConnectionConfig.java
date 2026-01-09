package com.bookstore.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

@Configuration
public class MongoConnectionConfig {

    private static final Logger logger = LoggerFactory.getLogger(MongoConnectionConfig.class);

    @Value("${spring.mongodb.uri:${spring.data.mongodb.uri:NOT_SET}}")
    private String mongoUri;

    @EventListener(ContextRefreshedEvent.class)
    public void logMongoConnectionString() {
        if ("NOT_SET".equals(mongoUri)) {
            logger.error("MongoDB URI is NOT SET in application.properties!");
        } else if (mongoUri.contains("localhost") || mongoUri.contains("127.0.0.1")) {
            logger.error("WARNING: Connection string points to LOCAL MongoDB, not Atlas!");
        }
    }
}


