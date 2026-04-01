package com.quitq.dto;

public class ProductDTO {

    private Long productId;
    private String categoryName;
    private String productName;
    private double price;
    private int stock;

    public ProductDTO() {}

    public ProductDTO(Long productId, String categoryName, String productName, double price, int stock) {
        this.productId = productId;
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
}