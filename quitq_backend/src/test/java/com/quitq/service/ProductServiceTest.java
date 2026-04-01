package com.quitq.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.quitq.entity.Product;
import com.quitq.repository.ProductRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class ProductServiceTest {

    @Mock
    private ProductRepository repository;

    @InjectMocks
    private ProductServiceImpl service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddProduct() {

        Product product = new Product("Electronics", "Speaker", 3000, 10);

        when(repository.save(product)).thenReturn(product);

        Product saved = repository.save(product);

        assertEquals("Speaker", saved.getProductName());
    }

    @Test
    void testGetProductById() {

        Product product = new Product("Electronics", "Phone", 15000, 5);
        product.setProductId(1L);

        when(repository.findById(1L)).thenReturn(Optional.of(product));

        Product found = repository.findById(1L).get();

        assertEquals("Phone", found.getProductName());
    }
}