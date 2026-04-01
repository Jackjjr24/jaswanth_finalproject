package com.quitq.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.quitq.entity.Cart;
import com.quitq.repository.CartRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class CartServiceTest {

    @Mock
    private CartRepository repository;

    @InjectMocks
    private CartService service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddToCart(){

        Cart cart = new Cart();
        cart.setUserId(1L);
        cart.setProductId(2L);
        cart.setQuantity(2);

        when(repository.save(cart)).thenReturn(cart);

        Cart saved = service.addToCart(cart);

        assertEquals(2, saved.getQuantity());
    }
}