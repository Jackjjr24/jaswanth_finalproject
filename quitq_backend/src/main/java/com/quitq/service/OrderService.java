package com.quitq.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.quitq.dto.ProductDTO;
import com.quitq.entity.Order;
import com.quitq.repository.OrderRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository repository;

    public ProductDTO getProductDetails(Long id){

        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForObject(
                "http://localhost:8080/api/products/" + id,
                ProductDTO.class
        );
    }

    public Order placeOrder(Order order){

        order.setOrderStatus("Placed");

        return repository.save(order);
    }
}