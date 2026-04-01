package com.quitq.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.quitq.entity.Cart;
import com.quitq.repository.CartRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository repository;

    public Cart addToCart(Cart cart) {
        return repository.save(cart);
    }

    public List<Cart> getUserCart(Long userId) {
        return repository.findByUserId(userId);
    }

    public void removeItem(Long id) {
        repository.deleteById(id);
    }
}