package com.quitq.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.quitq.dto.ProductDTO;
import com.quitq.entity.Order;
import com.quitq.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService service;

    @GetMapping("/product/{id}")
    public ProductDTO getProduct(@PathVariable Long id){
        return service.getProductDetails(id);
    }

    @PostMapping("/place")
    public Order placeOrder(@RequestBody Order order){
        return service.placeOrder(order);
    }
}