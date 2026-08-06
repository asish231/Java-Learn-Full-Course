package quickstart;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Minimal example of creating and using Arrays and ArrayLists in Java.
 */
public class ArrayAndListQuickstart {
    public static void main(String[] args) {
        // 1. Static Array (Fixed Size)
        int[] numbers = new int[3];
        numbers[0] = 10;
        numbers[1] = 20;
        numbers[2] = 30;

        System.out.println("Static Array: " + Arrays.toString(numbers));
        System.out.println("First element: " + numbers[0]);

        // 2. Dynamic Array (ArrayList)
        List<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Cherry");

        System.out.println("\nDynamic Array: " + fruits);
        System.out.println("Element at index 1: " + fruits.get(1));

        fruits.remove("Banana");
        System.out.println("After removing Banana: " + fruits);
    }
}
