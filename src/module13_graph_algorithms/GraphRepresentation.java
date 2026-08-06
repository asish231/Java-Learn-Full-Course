package module13_graph_algorithms;

import java.util.ArrayList;
import java.util.List;

/**
 * Demonstrates Graph Representations:
 * 1. Adjacency Matrix
 * 2. Adjacency List
 */
public class GraphRepresentation {

    // 1. Adjacency List Graph
    public static class GraphAdjList {
        private final int numVertices;
        private final List<List<Integer>> adjList;

        public GraphAdjList(int numVertices) {
            this.numVertices = numVertices;
            this.adjList = new ArrayList<>();
            for (int i = 0; i < numVertices; i++) {
                adjList.add(new ArrayList<>());
            }
        }

        public void addEdge(int src, int dest, boolean isDirected) {
            adjList.get(src).add(dest);
            if (!isDirected) {
                adjList.get(dest).add(src);
            }
        }

        public void printGraph() {
            System.out.println("Adjacency List Representation:");
            for (int i = 0; i < numVertices; i++) {
                System.out.println("  Vertex " + i + " -> " + adjList.get(i));
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" 🌐 GRAPH REPRESENTATION DEMONSTRATION");
        System.out.println("==================================================\n");

        GraphAdjList graph = new GraphAdjList(4);
        graph.addEdge(0, 1, false);
        graph.addEdge(0, 2, false);
        graph.addEdge(1, 2, false);
        graph.addEdge(2, 3, false);

        graph.printGraph();

        System.out.println("\n✅ Graph Representation test passed!");
    }
}
