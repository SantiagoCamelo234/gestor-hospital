package com.hospiapp.backend.datastructures;

import java.util.EmptyStackException;

public class CustomStack<T> {
    private static class Node<T> {
        T value;
        Node<T> next;
        Node(T value, Node<T> next) { this.value = value; this.next = next; }
    }

    private Node<T> top;
    private int size;

    public void push(T value) {
        top = new Node<>(value, top);
        size++;
    }

    public T pop() {
        if (top == null) throw new EmptyStackException();
        T v = top.value;
        top = top.next;
        size--;
        return v;
    }

    public T peek() {
        if (top == null) throw new EmptyStackException();
        return top.value;
    }

    public boolean isEmpty() { return top == null; }

    public int size() { return size; }
}


