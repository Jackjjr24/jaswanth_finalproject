package com.quitq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

import com.quitq.entity.User;
import com.quitq.repository.UserRepository;

@SpringBootApplication
public class QuitqApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuitqApplication.class, args);
    }

    @Bean
    CommandLineRunner run(UserRepository repo) {
        return args -> {

            repo.save(new User("admin", "admin123", "ADMIN"));

        };
    }
}