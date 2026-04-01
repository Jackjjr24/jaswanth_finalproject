package com.quitq.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.quitq.entity.User;
import com.quitq.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

 @Autowired
 private UserRepository repository;

 @Override
 public UserDetails loadUserByUsername(String username)
     throws UsernameNotFoundException {

  User user = repository.findByUsername(username);

  if(user==null){
   throw new UsernameNotFoundException("User not found");
  }

  return org.springframework.security.core.userdetails.User
   .withUsername(user.getUsername())
   .password("{noop}"+user.getPassword())
   .roles(user.getRole())
   .build();
 }
}