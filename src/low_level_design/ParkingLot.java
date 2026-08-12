package low_level_design;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * LLD: parking lot. Interview shape: vehicles, spots, tickets, fee.
 * Classes first, then a tiny simulation so you can defend the design.
 */
public class ParkingLot {

    enum Size { MOTORCYCLE, COMPACT, LARGE }

    static class Vehicle {
        final String plate;
        final Size size;
        Vehicle(String plate, Size size) { this.plate = plate; this.size = size; }
    }

    static class Spot {
        final int id;
        final Size size;
        Vehicle occupant;
        Spot(int id, Size size) { this.id = id; this.size = size; }
        boolean canFit(Vehicle v) { return occupant == null && v.size.ordinal() <= size.ordinal(); }
    }

    static class Ticket {
        final int spotId;
        final long inMs;
        Ticket(int spotId, long inMs) { this.spotId = spotId; this.inMs = inMs; }
    }

    static class Lot {
        final List<Spot> spots = new ArrayList<>();
        final Map<String, Ticket> tickets = new HashMap<>();

        Lot add(int id, Size size) { spots.add(new Spot(id, size)); return this; }

        Ticket park(Vehicle v) {
            for (Spot s : spots) {
                if (s.canFit(v)) {
                    s.occupant = v;
                    Ticket t = new Ticket(s.id, 0);
                    tickets.put(v.plate, t);
                    return t;
                }
            }
            return null;
        }

        int leave(String plate, int hours) {
            Ticket t = tickets.remove(plate);
            if (t == null) return -1;
            for (Spot s : spots) if (s.id == t.spotId) s.occupant = null;
            return Math.max(1, hours) * 10;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== LLD: Parking Lot ===");
        Lot lot = new Lot().add(1, Size.MOTORCYCLE).add(2, Size.COMPACT).add(3, Size.LARGE);
        Ticket car = lot.park(new Vehicle("KA-01", Size.COMPACT));
        Ticket bike = lot.park(new Vehicle("KA-02", Size.MOTORCYCLE));
        System.out.println("Car spot " + car.spotId + ", bike spot " + bike.spotId);
        System.out.println("Fee for 3h: " + lot.leave("KA-01", 3));
        System.out.println("Full lot for a second car? " + (lot.park(new Vehicle("KA-03", Size.LARGE)) != null));
        System.out.println("Talk: spots own occupancy, tickets own billing, vehicles never search the lot themselves.");
    }
}
