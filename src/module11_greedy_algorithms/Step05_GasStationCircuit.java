package module11_greedy_algorithms;

import java.util.Arrays;

/**
 * Step 05: Gas Station Circular Circuit (Greedy Balance Accumulation)
 *
 * <pre>
 * CIRCULAR GAS STATION BALANCE VISUALIZATION:
 *
 * Gas:  [1, 2, 3, 4, 5]
 * Cost: [3, 4, 5, 1, 2]
 * Net:  [-2, -2, -2, +3, +3] (gas[i] - cost[i])
 *
 * Step 0: Start candidate = 0, Net balance = -2 < 0 -> Fails! Reset candidate to 1, Tank = 0.
 * Step 1: Start candidate = 1, Net balance = -2 < 0 -> Fails! Reset candidate to 2, Tank = 0.
 * Step 2: Start candidate = 2, Net balance = -2 < 0 -> Fails! Reset candidate to 3, Tank = 0.
 * Step 3: Start candidate = 3, Net = +3 >= 0. Tank = 3. Candidate stays 3.
 * Step 4: i = 4, Net = +3. Tank = 3 + 3 = 6.
 *
 * Total Gas = 15, Total Cost = 15 -> Total Net = 0 >= 0 (Circuit Solution Exists!)
 * Starting Station Index = 3
 * </pre>
 */
public class Step05_GasStationCircuit {

    public static class CircuitResult {
        public final int startStationIndex;
        public final int totalNetGas;

        public CircuitResult(int startStationIndex, int totalNetGas) {
            this.startStationIndex = startStationIndex;
            this.totalNetGas = totalNetGas;
        }
    }

    /**
     * Determines starting gas station index to complete circular circuit.
     *
     * @param gas  amount of gas at station i
     * @param cost cost of gas to travel from station i to i + 1
     * @return starting station index, or -1 if impossible
     */
    public static CircuitResult canCompleteCircuit(int[] gas, int[] cost) {
        int totalTank = 0;
        int currentTank = 0;
        int startingStation = 0;

        for (int i = 0; i < gas.length; i++) {
            int net = gas[i] - cost[i];
            totalTank += net;
            currentTank += net;

            System.out.println("  [ACTION] Station " + i + ": Gas=" + gas[i] + ", Cost=" + cost[i]
                    + " | Net=" + net + " | Current Tank=" + currentTank);

            // If tank drops below 0, station i cannot be reached from current startingStation
            if (currentTank < 0) {
                startingStation = i + 1; // Greedily reset starting point to next station
                currentTank = 0;
                System.out.println("  [STATE] Tank Empty (< 0)! Greedily Reset Starting Station Candidate to " + startingStation);
            }
        }

        int finalStart = (totalTank >= 0) ? startingStation : -1;
        return new CircuitResult(finalStart, totalTank);
    }

    public static void main(String[] args) {
        System.out.println("======================================================================");
        System.out.println("Module 11 - Step 05: Gas Station Circular Circuit");
        System.out.println("======================================================================\n");

        int[] gas = {1, 2, 3, 4, 5};
        int[] cost = {3, 4, 5, 1, 2};

        System.out.println("[INIT] Gas Array:  " + Arrays.toString(gas));
        System.out.println("[INIT] Cost Array: " + Arrays.toString(cost));

        System.out.println("\n--- Simulating Greedy Circuit Traversal ---");
        CircuitResult res = canCompleteCircuit(gas, cost);

        System.out.println("\n[STATE] Total Net Gas Balance Across Circuit: " + res.totalNetGas);
        System.out.println("[STATE] Starting Station Index Found: " + res.startStationIndex);

        System.out.println("\n======================================================================");
        System.out.println("VERIFICATION SUCCESSFUL: Step05_GasStationCircuit executed cleanly.");
        System.out.println("======================================================================");
    }
}
