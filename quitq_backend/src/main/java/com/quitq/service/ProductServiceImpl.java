package com.quitq.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quitq.dto.ProductDTO;
import com.quitq.entity.Product;
import com.quitq.repository.ProductRepository;
import com.quitq.exception.ProductNotFoundException;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository repository;

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setProductName(product.getProductName());
        dto.setCategoryName(product.getCategoryName());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        return dto;
    }

    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setProductId(dto.getProductId());
        product.setProductName(dto.getProductName());
        product.setCategoryName(dto.getCategoryName());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        return product;
    }

    @Override
    public ProductDTO addProduct(ProductDTO dto) {
        Product product = convertToEntity(dto);
        return convertToDTO(repository.save(product));
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return repository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        return convertToDTO(product);
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO dto) {

        Product existing = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        existing.setProductName(dto.getProductName());
        existing.setCategoryName(dto.getCategoryName());
        existing.setPrice(dto.getPrice());
        existing.setStock(dto.getStock());

        return convertToDTO(repository.save(existing));
    }

    @Override
    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<ProductDTO> getByCategory(String category) {
        return repository.findByCategoryName(category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}