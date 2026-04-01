package com.quitq.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String categoryName;
    private String productName;
    private double price;
    private int stock;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private Seller seller;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "detail_id")
    private ProductDetail productDetail;

    public Product() {}

    public Product(String categoryName, String productName, double price, int stock) {
        this.categoryName = categoryName;
        this.productName = productName;
        this.price = price;
        this.stock = stock;
    }

    public Long getProductId() { return productId; }

    public void setProductId(Long productId) { this.productId = productId; }

    public String getCategoryName() { return categoryName; }

    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getProductName() { return productName; }

    public void setProductName(String productName) { this.productName = productName; }

    public double getPrice() { return price; }

    public void setPrice(double price) { this.price = price; }

    public int getStock() { return stock; }

    public void setStock(int stock) { this.stock = stock; }

    public Seller getSeller() { return seller; }

    public void setSeller(Seller seller) { this.seller = seller; }

    public ProductDetail getProductDetail() { return productDetail; }

    public void setProductDetail(ProductDetail productDetail) { this.productDetail = productDetail; }
}