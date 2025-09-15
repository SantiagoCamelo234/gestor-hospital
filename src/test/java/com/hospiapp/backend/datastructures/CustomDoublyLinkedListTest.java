package com.hospiapp.backend.datastructures;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CustomDoublyLinkedListTest {

    @Test
    void testAddAndRemove() {
        CustomDoublyLinkedList<String> list = new CustomDoublyLinkedList<>();
        list.add("a");
        list.add("b");
        list.addFirst("start");

        assertEquals(3, list.size());
        assertEquals("start", list.removeFirst());
        assertEquals("b", list.removeLast());
        assertEquals(1, list.size());
    }

    @Test
    void testIterator() {
        CustomDoublyLinkedList<Integer> list = new CustomDoublyLinkedList<>();
        list.add(1);
        list.add(2);
        int sum = 0;
        for (int i : list) sum += i;
        assertEquals(3, sum);
    }
}
