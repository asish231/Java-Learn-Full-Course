package module13_graph_algorithms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * ============================================================================
 * Step 01: Graph Representations (Adjacency Matrix vs. Adjacency List vs. Edge List)
 * ============================================================================
 * 
 * ASCII Diagram: Graph Representation Models
 * 
 * Graph Structure (4 Vertices, 5 Edges):
 * 
 *        (0)-------[6]------->(1)
 *         | \                 /|
 *        [1] \               / |
 *         |   [5]         [2] [3]
 *         v     \         /    v
 *        (2)-----[4]---->(3)<--+
 * 
 * 1. Adjacency Matrix (V x V 2D Array):
 *    Space Complexity: O(V^2)
 *    Edge Lookup (u -> v): O(1)
 *    Iterate Neighbors: O(V)
 * 
 *       To: 0   1   2   3
 *    From +---------------+
 *       0 |  0   6   1   5 |
 *       1 |  0   0   0   3 |
 *       2 |  0   0   0   4 |
 *       3 |  0   0   2   0 |
 * 
 * 2. Adjacency List (Array of Lists / List of Lists):
 *    Space Complexity: O(V + E)
 *    Edge Lookup (u -> v): O(degree(u))
 *    Iterate Neighbors: O(degree(u))
 * 
 *    [0] -> [(1, w:6), (2, w:1), (3, w:5)]
 *    [1] -> [(3, w:3)]
 *    [2] -> [(3, w:4)]
 *    [3] -> [(2, w:2)]
 * 
 * 3. Edge List (Collection of Edge Objects):
 *    Space Complexity: O(E)
 *    Edge Lookup: O(E)
 *    Iterate Neighbors: O(E)
 * 
 *    Edges = [ (0->1, w:6), (0->2, w:1), (0->3, w:5), (1->3, w:3), (2->3, w:4), (3->2, w:2) ]
 * ============================================================================
 */
public class Step01_GraphRepresentations {

    /**
     * Static helper class representing a weighted directed edge.
     */
    public static class Edge {
        private final int src;
        private final int dest;
        private final int weight;

        public Edge(int src, int dest, int weight) {
            this.src = src;
            this.dest = dest;
            this.weight = weight;
        }

        public int getSrc() {
            return src;
        }

        public int getDest() {
            return dest;
        }

        public int getWeight() {
            return weight;
        }

        @Override
        public String toString() {
            return "(" + src + " -> " + dest + ", w=" + weight + ")";
        }
    }

    /**
     * Adjacency Matrix Representation
     */
    public static class MatrixGraph {
        private final int numVertices;
        private final int[][] matrix;

        public MatrixGraph(int numVertices) {
            this.numVertices = numVertices;
            this.matrix = new int[numVertices][numVertices];
        }

        public void addEdge(int u, int v, int weight) {
            matrix[u][v] = weight;
        }

        public boolean hasEdge(int u, int v) {
            return matrix[u][v] != 0;
        }

        public int getEdgeWeight(int u, int v) {
            return matrix[u][v];
        }

        public List<Integer> getNeighbors(int u) {
            List<Integer> neighbors = new ArrayList<>();
            for (int v = 0; v < numVertices; v++) {
                if (matrix[u][v] != 0) {
                    neighbors.add(v);
                }
            }
            return neighbors;
        }

        public void printMatrix() {
            System.out.println("  Adjacency Matrix (" + numVertices + "x" + numVertices + "):");
            System.out.print("      ");
            for (int j = 0; j < numVertices; j++) {
                System.out.printf("[%d] ", j);
            }
            System.out.println();
            for (int i = 0; i < numVertices; i++) {
                System.out.printf("  [%d] ", i);
                for (int j = 0; j < numVertices; j++) {
                    System.out.printf(" %2d ", matrix[i][j]);
                }
                System.out.println();
            }
        }
    }

    /**
     * Adjacency List Representation
     */
    public static class ListGraph {
        private final int numVertices;
        private final List<List<Edge>> adjList;

        public ListGraph(int numVertices) {
            this.numVertices = numVertices;
            this.adjList = new ArrayList<>(numVertices);
            for (int i = 0; i < numVertices; i++) {
                adjList.add(new ArrayList<>());
            }
        }

        public void addEdge(int u, int v, int weight) {
            adjList.get(u).add(new Edge(u, v, weight));
        }

        public boolean hasEdge(int u, int v) {
            for (Edge e : adjList.get(u)) {
                if (e.getDest() == v) {
                    return true;
                }
            }
            return false;
        }

        public List<Edge> getEdgesFrom(int u) {
            return adjList.get(u);
        }

        public void printList() {
            System.out.println("  Adjacency List:");
            for (int i = 0; i < numVertices; i++) {
                System.out.print("  [" + i + "] -> ");
                List<Edge> edges = adjList.get(i);
                if (edges.isEmpty()) {
                    System.out.println("Empty");
                } else {
                    System.out.println(edges);
                }
            }
        }
    }

    /**
     * Edge List Representation
     */
    public static class EdgeListGraph {
        private final List<Edge> edges;

        public EdgeListGraph() {
            this.edges = new ArrayList<>();
        }

        public void addEdge(int u, int v, int weight) {
            edges.add(new Edge(u, v, weight));
        }

        public List<Edge> getEdges() {
            return edges;
        }

        public void printEdgeList() {
            System.out.println("  Edge List (total edges = " + edges.size() + "):");
            System.out.println("  " + edges);
        }
    }

    public static void main(String[] args) {
        System.out.println("=================================================================");
        System.out.println("   Step 01: Graph Representations Demonstration");
        System.out.println("=================================================================");

        int numVertices = 4;
        System.out.println("[INIT] Initializing 4-node directed graph structures...");

        MatrixGraph matrixGraph = new MatrixGraph(numVertices);
        ListGraph listGraph = new ListGraph(numVertices);
        EdgeListGraph edgeListGraph = new EdgeListGraph();

        System.out.println("[MEMORY EVENT] Allocated Adjacency Matrix (4x4 int[][]), ListGraph (ArrayList<List<Edge>>), EdgeList (ArrayList<Edge>)");

        // Edge definitions (src, dest, weight)
        int[][] edgeData = {
            {0, 1, 6},
            {0, 2, 1},
            {0, 3, 5},
            {1, 3, 3},
            {2, 3, 4},
            {3, 2, 2}
        };

        System.out.println("[ACTION] Populating graph edges into all 3 representations...");
        for (int[] e : edgeData) {
            int u = e[0];
            int v = e[1];
            int w = e[2];
            matrixGraph.addEdge(u, v, w);
            listGraph.addEdge(u, v, w);
            edgeListGraph.addEdge(u, v, w);
            System.out.printf("   Added Edge: %d -> %d (weight: %d)%n", u, v, w);
        }

        System.out.println("\n[STATE] --- 1. Adjacency Matrix Representation ---");
        matrixGraph.printMatrix();

        System.out.println("\n[STATE] --- 2. Adjacency List Representation ---");
        listGraph.printList();

        System.out.println("\n[STATE] --- 3. Edge List Representation ---");
        edgeListGraph.printEdgeList();

        System.out.println("\n[ACTION] Testing Edge Queries and Neighborhood Iterations...");
        
        // Edge Existence Query
        System.out.println("   Query: Does edge (0 -> 2) exist?");
        System.out.println("     Matrix Lookup O(1): " + matrixGraph.hasEdge(0, 2) + " (weight: " + matrixGraph.getEdgeWeight(0, 2) + ")");
        System.out.println("     List Lookup O(deg(0)): " + listGraph.hasEdge(0, 2));

        System.out.println("   Query: Does edge (1 -> 0) exist?");
        System.out.println("     Matrix Lookup O(1): " + matrixGraph.hasEdge(1, 0));
        System.out.println("     List Lookup O(deg(1)): " + listGraph.hasEdge(1, 0));

        // Neighbor Retrieval
        System.out.println("\n[STATE] Neighbor retrieval for Node 0:");
        System.out.println("   Matrix neighbors: " + matrixGraph.getNeighbors(0));
        System.out.println("   List edges: " + listGraph.getEdgesFrom(0));

        System.out.println("\n[MEMORY EVENT] Graph representation benchmark summary:");
        System.out.println("   Adjacency Matrix space: O(V^2) = " + (numVertices * numVertices) + " cells");
        System.out.println("   Adjacency List space: O(V + E) = " + numVertices + " nodes + " + edgeData.length + " edges");
        System.out.println("   Edge List space: O(E) = " + edgeData.length + " edge objects");

        System.out.println("=================================================================");
        System.out.println("   Step 01 Completed Successfully!");
        System.out.println("=================================================================");
    }
}
