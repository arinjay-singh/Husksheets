package API.Tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestGetUpdatesForSubscriptionAPI {

    @Mock
    private GetUpdatesForSubscriptionAPI subscriptionAPI;
    private AutoCloseable closeable;

    @BeforeEach
    public void setUp(){
        Mockito.openAnnotations(this);
    }

    @AfterEach
    public void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    public void testSubscriptionResponse() {
        Map<String, Object> argument = new HashMap<>();
        argument.put("publisher", "alice");
        argument.put("sheet", "Sheet1");
        argument.put("id", 10);

        Map<String, Object> expectedResponse = new HashMap<>();
        List<Map<String, Object>> payload = Arrays.asList(
                mockUpdate("Update1", 11),
                mockUpdate("Update2", 12)
        );
        expectedResponse.put("payload", payload);
        expectedResponse.put("id", 12);
        //when(subscriptionAPI.getUpdatesForSubscription(argument)).thenReturn(expectedResponse);

        Map<String, Object> actualResponse = subscriptionAPI.getUpdatesForSubscription(argument);

        assertEquals(expectedResponse, actualResponse);
    }

    private static Map<String, Object> mockUpdate(String payloadData, int id) {
        Map<String, Object> update = new HashMap<>();
        update.put("data", payloadData);
        update.put("id", id);
        return update;
    }
}
