package com.hospiapp.backend.services;

import com.hospiapp.backend.datastructures.CustomStack;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActionHistoryService {

    public interface UndoableAction {
        String description();
        void undo();
    }

    private final CustomStack<UndoableAction> stack = new CustomStack<>();
    private final List<String> log = new ArrayList<>();

    public void push(UndoableAction action) {
        stack.push(action);
        log.add(action.description());
    }

    public String undo() {
        if (stack.isEmpty()) return "Nada para deshacer";
        UndoableAction a = stack.pop();
        a.undo();
        return "Deshecho: " + a.description();
    }

    public List<String> history() {
        return new ArrayList<>(log);
    }
}













