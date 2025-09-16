package com.hospiapp.backend.datastructures;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CustomHashMapTest {

    @Test
    void basicPutGetRemove() {
        CustomHashMap<String, Integer> map = new CustomHashMap<>();
        map.put("uno", 1);
        map.put("dos", 2);

        assertEquals(1, map.get("uno"));
        assertTrue(map.containsKey("dos"));

        map.remove("uno");
        assertNull(map.get("uno"));
    }
}
