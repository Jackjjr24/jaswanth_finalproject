package com.quitq.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.quitq.entity.Order;

import org.junit.jupiter.api.Test;

class OrderServiceTest {

    OrderService service = new OrderService();

    @Test
    void testPlaceOrder() {

        Order order = new Order();
        order.setOrderStatus("Placed");

        Order placed = service.placeOrder(order);

        assertEquals("Placed", placed.getOrderStatus());
    }
}