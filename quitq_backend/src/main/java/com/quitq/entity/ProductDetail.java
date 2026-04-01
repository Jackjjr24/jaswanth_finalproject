package com.quitq.entity;

import jakarta.persistence.*;

@Entity
public class ProductDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detailId;

    private String description;
    private String brand;

    public ProductDetail() {}

    public ProductDetail(String description, String brand) {
        this.description = description;
        this.brand = brand;
    }

    public Long getDetailId() { return detailId; }

    public void setDetailId(Long detailId) { this.detailId = detailId; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getBrand() { return brand; }

    public void setBrand(String brand) { this.brand = brand; }
}