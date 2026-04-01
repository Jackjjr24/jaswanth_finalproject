package com.quitq.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sellerId;

    private String sellerName;

    @OneToMany(mappedBy = "seller")
    private List<Product> products;

    public Seller() {}

    public Seller(String sellerName) {
        this.sellerName = sellerName;
    }

    public Long getSellerId() { return sellerId; }

    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public String getSellerName() { return sellerName; }

    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
}