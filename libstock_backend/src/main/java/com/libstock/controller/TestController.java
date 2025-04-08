package com.libstock.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = { RequestMethod.GET, RequestMethod.POST,
        RequestMethod.OPTIONS })
public class TestController {

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @RequestMapping(value = "/ping", method = RequestMethod.OPTIONS)
    public String handleOptions() {
        return "pong";
    }
}