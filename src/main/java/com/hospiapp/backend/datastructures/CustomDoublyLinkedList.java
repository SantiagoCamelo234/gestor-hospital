package com.hospiapp.backend.datastructures;

import java.util.Iterator;
import java.util.NoSuchElementException;

public class CustomDoublyLinkedList<T> implements Iterable<T> {

    private static class Node<T> {
        T value;
        Node<T> prev, next;
        Node(T value) { this.value = value; }
    }

    private Node<T> head, tail;
    private int size;

    public void add(T data) {
        Node node = new Node(data);
        if (head == null) {
            head = tail = node;
        } else {
            tail.next = node;
            node.prev = tail;
            tail = node;
        }
        size++;
    }

    public void addFirst(T value) {
        Node<T> n = new Node<>(value);
        if (head == null) {
            head = tail = n;
        } else {
            n.next = head;
            head.prev = n;
            head = n;
        }
        size++;
    }

    public void addLast(T value) {
        Node<T> n = new Node<>(value);
        if (tail == null) {
            head = tail = n;
        } else {
            tail.next = n;
            n.prev = tail;
            tail = n;
        }
        size++;
    }

    public T removeFirst() {
        if (head == null) throw new NoSuchElementException();
        T val = head.value;
        head = head.next;
        if (head != null) head.prev = null;
        else tail = null;
        size--;
        return val;
    }

    public T removeLast() {
        if (tail == null) throw new NoSuchElementException();
        T val = tail.value;
        tail = tail.prev;
        if (tail != null) tail.next = null;
        else head = null;
        size--;
        return val;
    }

    public int size() { return size; }

    public boolean remove(T value) {
        Node<T> curr = head;
        while (curr != null) {
            if ((value == null && curr.value == null) || (value != null && value.equals(curr.value))) {
                Node<T> prev = curr.prev;
                Node<T> next = curr.next;
                if (prev != null) prev.next = next; else head = next;
                if (next != null) next.prev = prev; else tail = prev;
                size--;
                return true;
            }
            curr = curr.next;
        }
        return false;
    }

    @Override
    public Iterator<T> iterator() {
        return new Iterator<>() {
            Node<T> curr = head;
            @Override
            public boolean hasNext() { return curr != null; }
            @Override
            public T next() {
                if (!hasNext()) throw new NoSuchElementException();
                T v = curr.value;
                curr = curr.next;
                return v;
            }
        };
    }
}
