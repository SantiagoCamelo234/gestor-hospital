package com.hospiapp.backend.datastructures;

import java.util.ArrayList;
import java.util.List;

/**
 * Árbol binario de búsqueda genérico muy simple para ordenar elementos por clave comparable.
 * No balanceado; suficiente para demostrar in-order traversal y paginación en memoria.
 */
public class CustomBST<K extends Comparable<K>, V> {

    private class Node {
        K key;
        V value;
        Node left;
        Node right;
        Node(K key, V value) { this.key = key; this.value = value; }
    }

    private Node root;

    public void insert(K key, V value) {
        root = insert(root, key, value);
    }

    private Node insert(Node node, K key, V value) {
        if (node == null) return new Node(key, value);
        int cmp = key.compareTo(node.key);
        if (cmp < 0) node.left = insert(node.left, key, value);
        else node.right = insert(node.right, key, value);
        return node;
    }

    public List<V> inOrder() {
        List<V> result = new ArrayList<>();
        inOrder(root, result);
        return result;
    }

    private void inOrder(Node node, List<V> acc) {
        if (node == null) return;
        inOrder(node.left, acc);
        acc.add(node.value);
        inOrder(node.right, acc);
    }
}


