package com.hospiapp.backend.controllers;

import com.hospiapp.backend.services.ActionHistoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    private final ActionHistoryService historyService;

    public SystemController(ActionHistoryService historyService) {
        this.historyService = historyService;
    }

    @PostMapping("/undo")
    public String undo() {
        return historyService.undo();
    }

    @GetMapping("/actions")
    public List<String> actions() {
        return historyService.history();
    }
}


