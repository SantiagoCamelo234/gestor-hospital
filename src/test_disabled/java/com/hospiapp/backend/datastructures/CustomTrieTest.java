package com.hospiapp.backend.datastructures;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CustomTrieTest {

    @Test
    void testInsertAndSearch() {
        CustomTrie trie = new CustomTrie();
        trie.insert("juan");
        trie.insert("julia");

        assertTrue(trie.contains("juan"));
        assertFalse(trie.contains("jose"));

        assertEquals(2, trie.startsWith("ju", 5).size());
    }
}
