package com.hospiapp.backend.datastructures;

import java.util.Objects;

/**
 * Implementación básica de un HashMap propio usando encadenamiento.
 */
public class CustomHashMap<K, V> {

    private static final int DEFAULT_CAPACITY = 16;
    private static final float LOAD_FACTOR = 0.75f;

    static class Node<K, V> {
        K key;
        V value;
        Node<K, V> next;

        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }

    private Node<K, V>[] table;
    private int size;
    private int threshold;

    @SuppressWarnings("unchecked")
    public CustomHashMap() {
        table = new Node[DEFAULT_CAPACITY];
        threshold = (int) (DEFAULT_CAPACITY * LOAD_FACTOR);
    }

    private int hash(K key) {
        return (key == null) ? 0 : (Objects.hashCode(key) & 0x7fffffff) % table.length;
    }

    public int size() {
        return size;
    }

    public boolean containsKey(K key) {
        return get(key) != null;
    }

    public V get(K key) {
        int idx = hash(key);
        Node<K, V> node = table[idx];
        while (node != null) {
            if (Objects.equals(node.key, key)) {
                return node.value;
            }
            node = node.next;
        }
        return null;
    }

    public V put(K key, V value) {
        int idx = hash(key);
        Node<K, V> node = table[idx];
        while (node != null) {
            if (Objects.equals(node.key, key)) {
                V old = node.value;
                node.value = value;
                return old;
            }
            node = node.next;
        }
        Node<K, V> newNode = new Node<>(key, value);
        newNode.next = table[idx];
        table[idx] = newNode;
        size++;

        if (size > threshold) {
            resize();
        }
        return null;
    }

    public V remove(K key) {
        int idx = hash(key);
        Node<K, V> node = table[idx];
        Node<K, V> prev = null;
        while (node != null) {
            if (Objects.equals(node.key, key)) {
                if (prev == null) {
                    table[idx] = node.next;
                } else {
                    prev.next = node.next;
                }
                size--;
                return node.value;
            }
            prev = node;
            node = node.next;
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private void resize() {
        Node<K, V>[] oldTable = table;
        table = new Node[oldTable.length * 2];
        threshold = (int) (table.length * LOAD_FACTOR);
        size = 0;
        for (Node<K, V> head : oldTable) {
            Node<K, V> node = head;
            while (node != null) {
                put(node.key, node.value);
                node = node.next;
            }
        }
    }
}
