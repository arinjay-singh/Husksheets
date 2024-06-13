package Tests;

import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Sheet;
import com.husksheets_api_server_scrumlords.serialize.SerializationUtil;
import com.husksheets_api_server_scrumlords.services.GetUpdatesService;
import com.husksheets_api_server_scrumlords.services.UpdatePublishedService;
import com.husksheets_api_server_scrumlords.services.UpdateSubscriptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test all 'Update' Services
 * @author Kaan Tural
 */
public class TestUpdateServices {
    private UpdateSubscriptionService updateSubscriptionService;
    private UpdatePublishedService updatePublishedService;
    private GetUpdatesService getUpdatesService;
    private Publishers publishers;

    @BeforeEach
    void setUp() {
        SerializationUtil.clearSerializedData("publishers.ser");
        updateSubscriptionService = new UpdateSubscriptionService();
        updatePublishedService = new UpdatePublishedService();
        getUpdatesService = new GetUpdatesService();
        this.publishers = Publishers.getInstance();
        this.publishers.getPublisherMap().clear();
    }

    @Test
    void testUpdateSubscription_ValidInputs() {
        String requestPublisher = "publisher1";
        String requestSheet = "sheet1";
        String requestPayload = "payload";

        Sheet sheet = setupPublisherAndSheet(requestPublisher, requestSheet);

        Response response = updateSubscriptionService.updateSubscription(requestPublisher, requestSheet, requestPayload);

        assertTrue(response.isSuccess());
        assertTrue(sheet.getUpdatesForPublished().contains(requestPayload));
    }

    @Test
    void testUpdateSubscription_InvalidPublisherOrSheet() {
        String requestPublisher = "invalidPublisher";
        String requestSheet = "invalidSheet";
        String requestPayload = "payload";

        Response response = updateSubscriptionService.updateSubscription(requestPublisher, requestSheet, requestPayload);

        assertFalse(response.isSuccess());
        assertNotNull(response.getMessage());
    }

    @Test
    void testUpdateSubscription_InvalidPayload() {
        String requestPublisher = "publisher1";
        String requestSheet = "sheet1";
        String requestPayload = null;

        setupPublisherAndSheet(requestPublisher, requestSheet);

        Response response = updateSubscriptionService.updateSubscription(requestPublisher, requestSheet, requestPayload);

        assertFalse(response.isSuccess());
        assertEquals("Payload is null", response.getMessage());
    }

    @Test
    void testUpdatePublished_ValidInputs() {
        String requestPublisher = "publisher1";
        String requestSheet = "sheet1";
        String requestPayload = "payload";

        Sheet sheet = setupPublisherAndSheet(requestPublisher, requestSheet);

        Response response = updatePublishedService.updatePublished(requestPublisher, requestSheet, requestPayload);

        assertTrue(response.isSuccess());
        assertTrue(sheet.getUpdatesForSubscription().contains(requestPayload));
    }

    @Test
    void testUpdatePublished_InvalidPublisherOrSheet() {
        String requestPublisher = "invalidPublisher";
        String requestSheet = "invalidSheet";
        String requestPayload = "payload";

        Response response = updatePublishedService.updatePublished(requestPublisher, requestSheet, requestPayload);

        assertFalse(response.isSuccess());
        assertNotNull(response.getMessage());
    }

    @Test
    void testUpdatePublished_InvalidPayload() {
        String requestPublisher = "publisher1";
        String requestSheet = "sheet1";
        String requestPayload = null;

        setupPublisherAndSheet(requestPublisher, requestSheet);

        Response response = updatePublishedService.updatePublished(requestPublisher, requestSheet, requestPayload);

        assertFalse(response.isSuccess());
        assertEquals("Payload is null", response.getMessage());
    }

    @Test
    void testGetUpdatesSubscribed_ValidInputs() {
        String requestPublisher = "publisher1";
        String requestSheet = "sheet1";
        String id = "0";
        GetUpdatesService.UpdateType updateType = GetUpdatesService.UpdateType.SUBSCRIPTION;

        Publisher newPublisher = new Publisher(requestPublisher);
        publishers.addNewPublisher(newPublisher.getName());
        Publisher publisher = publishers.getPublisher(requestPublisher);
        Sheet sheet = new Sheet(requestSheet, requestPublisher);
        sheet.addNewUpdateSubscription("subscriptionUpdate");
        publisher.addSheet(sheet);

        Response response = getUpdatesService.getUpdates(requestPublisher, requestSheet, id, updateType);

        assertTrue(response.isSuccess());
        assertNotNull(response.getValue());
        assertEquals(1, response.getValue().size());
        assertEquals("subscriptionUpdate\n", response.getValue().get(0).getPayload());
    }

    @Test
    void testGetUpdatesPublished_ValidInputs() {
        String requestPublisher = "publisher1";
        String requestSheet = "sheet1";
        String id = "0";
        GetUpdatesService.UpdateType updateType = GetUpdatesService.UpdateType.PUBLISHED;

        Publisher newPublisher = new Publisher(requestPublisher);
        publishers.addNewPublisher(newPublisher.getName());
        Publisher publisher = publishers.getPublisher(requestPublisher);
        Sheet sheet = new Sheet(requestSheet, requestPublisher);
        sheet.addNewUpdatePublished("subscriptionUpdate");
        publisher.addSheet(sheet);

        Response response = getUpdatesService.getUpdates(requestPublisher, requestSheet, id, updateType);

        assertTrue(response.isSuccess());
        assertNotNull(response.getValue());
        assertEquals(1, response.getValue().size());
        assertEquals("subscriptionUpdate\n", response.getValue().get(0).getPayload());
    }

    @Test
    void testGetUpdates_InvalidPublisherOrSheet() {
        String requestPublisher = "invalidPublisher";
        String requestSheet = "invalidSheet";
        String id = "1";
        GetUpdatesService.UpdateType updateType = GetUpdatesService.UpdateType.SUBSCRIPTION;

        Response response = getUpdatesService.getUpdates(requestPublisher, requestSheet, id, updateType);

        assertFalse(response.isSuccess());
        assertNotNull(response.getMessage());
    }

    @Test
    void testGetUpdates_InvalidId() {
        String requestPublisher = "publisher1";
        String requestSheet = "sheet1";
        String id = "invalidId";
        GetUpdatesService.UpdateType updateType = GetUpdatesService.UpdateType.SUBSCRIPTION;

        setupPublisherAndSheet(requestPublisher, requestSheet);

        Response response = getUpdatesService.getUpdates(requestPublisher, requestSheet, id, updateType);

        assertFalse(response.isSuccess());
        assertEquals("ID is not a number", response.getMessage());
    }

    @Test
    void testUpdateNullPublisher() {
        String requestPublisher = null;
        String requestSheet = "sheet1";
        String requestPayload = "payload";

        Response response = updateSubscriptionService.updateSubscription(requestPublisher, requestSheet, requestPayload);

        assertFalse(response.isSuccess());
        assertEquals("Publisher is null", response.getMessage());
    }

    @Test
    void testUpdateNullSheet() {
        String requestPublisher = "publisher1";
        String requestSheet = null;
        String requestPayload = "payload";

        Response response = updateSubscriptionService.updateSubscription(requestPublisher, requestSheet, requestPayload);

        assertFalse(response.isSuccess());
        assertEquals("Sheet is null", response.getMessage());
    }

    @Test
    void testUpdateNullID() {
        String requestPublisher = "publisher1";
        String requestSheet = "sheet1";
        String id = null;
        GetUpdatesService.UpdateType updateType = GetUpdatesService.UpdateType.SUBSCRIPTION;

        setupPublisherAndSheet(requestPublisher, requestSheet);
        Response response = getUpdatesService.getUpdates(requestPublisher, requestSheet, id, updateType);

        assertFalse(response.isSuccess());
        assertEquals("ID is null", response.getMessage());
    }

    private Sheet setupPublisherAndSheet(String requestPublisher, String requestSheet) {
        Publisher newPublisher = new Publisher(requestPublisher);
        publishers.addNewPublisher(newPublisher.getName());
        Sheet sheet = new Sheet(requestSheet, requestPublisher);
        Publisher publisher = publishers.getPublisher(requestPublisher);
        publisher.addSheet(sheet);
        return sheet;
    }
}