package low_level_design;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * LLD: in-process pub/sub. Topics, subscribers, fan-out.
 * Same shape as Kafka/SNS at interview scale — without a broker.
 */
public class PubSubBroker {

    interface Handler { void onMessage(String topic, String body); }

    static class Broker {
        private final Map<String, List<Handler>> subs = new HashMap<>();

        void subscribe(String topic, Handler h) {
            subs.computeIfAbsent(topic, k -> new ArrayList<>()).add(h);
        }

        int publish(String topic, String body) {
            List<Handler> hs = subs.getOrDefault(topic, List.of());
            for (Handler h : hs) h.onMessage(topic, body);
            return hs.size();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== LLD: Pub/Sub ===");
        Broker bus = new Broker();
        List<String> inbox = new ArrayList<>();
        bus.subscribe("orders", (t, b) -> inbox.add("email:" + b));
        bus.subscribe("orders", (t, b) -> inbox.add("metrics:" + b));
        int n = bus.publish("orders", "order-9");
        System.out.println("Fan-out " + n + " -> " + inbox);
        System.out.println("Talk: publisher never names consumers. At-least-once: retry + idempotent handlers.");
        System.out.println("Kafka adds partitions and offsets; SNS/SQS splits fan-out from work queues.");
    }
}
