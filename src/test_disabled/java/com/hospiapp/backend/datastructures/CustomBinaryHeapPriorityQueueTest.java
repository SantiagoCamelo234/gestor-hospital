package com.hospiapp.backend.datastructures;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CustomBinaryHeapPriorityQueueTest {

    @Test
    void testAddAndPoll() {
        CustomBinaryHeapPriorityQueue<Integer> heap = new CustomBinaryHeapPriorityQueue<>();
        heap.add(5);
        heap.add(1);
        heap.add(3);

        assertEquals(1, heap.poll());
        assertEquals(3, heap.poll());
        assertEquals(5, heap.poll());
        assertNull(heap.poll());
    }

    @Test
    void testGetAll() {
        CustomBinaryHeapPriorityQueue<Integer> heap = new CustomBinaryHeapPriorityQueue<>();
        heap.add(2);
        heap.add(4);
        assertEquals(2, heap.getAll().size());
    }
}
