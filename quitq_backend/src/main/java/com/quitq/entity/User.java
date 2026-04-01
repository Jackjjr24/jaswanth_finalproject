package com.quitq.entity;

import jakarta.persistence.*;

@Entity
public class User {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private String username;
 private String password;
 private String role;
 private String name;
 private String email;
 private String securityQuestion1;
 private String securityAnswer1;
 private String securityQuestion2;
 private String securityAnswer2;

 public User(){}

 public User(String username,String password,String role){
  this.username=username;
  this.password=password;
  this.role=role;
 }

 public Long getId(){ return id; }
 public void setId(Long id){ this.id=id; }

 public String getUsername(){ return username; }
 public void setUsername(String username){ this.username=username; }

 public String getPassword(){ return password; }
 public void setPassword(String password){ this.password=password; }

 public String getRole(){ return role; }
 public void setRole(String role){ this.role=role; }

 public String getName(){ return name; }
 public void setName(String name){ this.name=name; }

 public String getEmail(){ return email; }
 public void setEmail(String email){ this.email=email; }

 public String getSecurityQuestion1(){ return securityQuestion1; }
 public void setSecurityQuestion1(String securityQuestion1){ this.securityQuestion1=securityQuestion1; }

 public String getSecurityAnswer1(){ return securityAnswer1; }
 public void setSecurityAnswer1(String securityAnswer1){ this.securityAnswer1=securityAnswer1; }

 public String getSecurityQuestion2(){ return securityQuestion2; }
 public void setSecurityQuestion2(String securityQuestion2){ this.securityQuestion2=securityQuestion2; }

 public String getSecurityAnswer2(){ return securityAnswer2; }
 public void setSecurityAnswer2(String securityAnswer2){ this.securityAnswer2=securityAnswer2; }
}