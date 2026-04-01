package com.quitq.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.quitq.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
    User findByEmail(String email);
}