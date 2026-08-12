package module02_arrays_and_strings;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Common matrix interview patterns.
 *
 * Topics covered:
 *   - Set matrix zeroes (LeetCode 73)
 *   - Rotate image 90 degrees clockwise (LeetCode 48)
 *   - Spiral matrix traversal (LeetCode 54)
 */
public class MatrixPatterns {

    public static void setZeroes(int[][] matrix) {
        if (matrix == null || matrix.length == 0) return;
        int m = matrix.length, n = matrix[0].length;
        boolean firstRowZero = false, firstColZero = false;
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) firstColZero = true;
        }
        for (int j = 0; j < n; j++) {
            if (matrix[0][j] == 0) firstRowZero = true;
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][j] == 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
            }
        }
        if (firstColZero) for (int i = 0; i < m; i++) matrix[i][0] = 0;
        if (firstRowZero) for (int j = 0; j < n; j++) matrix[0][j] = 0;
    }

    public static void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int tmp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = tmp;
            }
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n / 2; j++) {
                int tmp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];
                matrix[i][n - 1 - j] = tmp;
            }
        }
    }

    public static List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        if (matrix == null || matrix.length == 0) return res;
        int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) res.add(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);
            right--;
            if (top <= bottom) for (int j = right; j >= left; j--) res.add(matrix[bottom][j]);
            bottom--;
            if (left <= right) for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);
            left++;
        }
        return res;
    }

    public static void main(String[] args) {
        System.out.println("--- Matrix Patterns ---");
        int[][] m = {{1, 1, 1}, {1, 0, 1}, {1, 1, 1}};
        setZeroes(m);
        System.out.println("Set zeroes: " + Arrays.deepToString(m));

        int[][] img = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        rotate(img);
        System.out.println("Rotated image: " + Arrays.deepToString(img));

        int[][] spiral = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        System.out.println("Spiral order: " + spiralOrder(spiral));
    }
}
