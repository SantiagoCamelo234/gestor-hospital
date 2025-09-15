package com.hospiapp.backend.datastructures;

import java.util.ArrayList;
import java.util.List;

/**
 * Trie simple para autocompletar nombres.
 */
public class CustomTrie {

    static class Node {
        Node[] next = new Node[27]; // 26 letras + espacio
        boolean end;
    }

    private final Node root = new Node();

    private int idx(char c) {
        return (c == ' ') ? 26 : (Character.toLowerCase(c) - 'a');
    }

    public void insert(String word) {
        Node curr = root;
        for (char c : word.toLowerCase().toCharArray()) {
            int i = idx(c);
            if (i < 0 || i >= 27) continue; // ignorar caracteres raros
            if (curr.next[i] == null) {
                curr.next[i] = new Node();
            }
            curr = curr.next[i];
        }
        curr.end = true;
    }

    public boolean contains(String word) {
        Node curr = root;
        for (char c : word.toLowerCase().toCharArray()) {
            int i = idx(c);
            if (i < 0 || i >= 27 || curr.next[i] == null) {
                return false;
            }
            curr = curr.next[i];
        }
        return curr.end;
    }

    public List<String> startsWith(String prefix, int limit) {
        List<String> result = new ArrayList<>();
        Node curr = root;
        for (char c : prefix.toLowerCase().toCharArray()) {
            int i = idx(c);
            if (i < 0 || i >= 27 || curr.next[i] == null) {
                return result;
            }
            curr = curr.next[i];
        }
        dfs(curr, new StringBuilder(prefix.toLowerCase()), result, limit);
        return result;
    }

    private void dfs(Node node, StringBuilder path, List<String> result, int limit) {
        if (result.size() >= limit) return;
        if (node.end) {
            result.add(path.toString());
        }
        for (int i = 0; i < 27; i++) {
            if (node.next[i] != null) {
                char c = (i == 26) ? ' ' : (char) ('a' + i);
                path.append(c);
                dfs(node.next[i], path, result, limit);
                path.deleteCharAt(path.length() - 1);
            }
        }
    }
}
