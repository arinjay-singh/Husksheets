//package Tests;
//
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mock;
//
//import java.util.Arrays;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//public class TestGetSheetsAPI {
//
//    @Mock
//    private GetSheets getSheetsInstance;
//    private GetSheetsAPI getSheetsAPI;
//    private AutoCloseable closeable;
//
//    @BeforeEach
//    public void setUp(){
//        Mockito.openAnnotations(this);
//    }
//
//    @AfterEach
//    public void tearDown() throws Exception {
//        closeable.close();
//    }
//
//    @Test
//    public void testGetSheetsResponse() {
//        //Mock Response
//        Map<String, String> argument = new HashMap<>();
//        argument.put("publisher", "alice");
//        List<Map<String, Object>> expectedSheets = Arrays.asList(
//                mockValuesResponse("alice", "default"),
//                mockValuesResponse("alice", "Sheet 2"),
//                mockValuesResponse("alice", "Sheet1"),
//                mockValuesResponse("Alice", "test1"),
//                mockValuesResponse("alice", "Sheet3")
//        );
//
//        Map<String, Object> expectedResponse = new HashMap<>();
//        expectedResponse.put("success", true);
//        expectedResponse.put("message", null);
//        expectedResponse.put("value", expectedSheets);
//        expectedResponse.put("time", System.currentTimeMillis());
//
//
//        //Actual Response
//        Map<String, Object> actualResponse = getSheetsAPI.getSheets(argument);
//
//        //Time adjustment
//        expectedResponse.put("time", actualResponse.get("time"));
//
//        //Test
//        assertEquals(expectedResponse, actualResponse);
//    }
//
//    private static Map<String, Object> mockValuesResponse(String publisher, String sheet){
//        Map<String, Object> response = new HashMap<>();
//        response.put("publisher", publisher);
//        response.put("sheet", sheet);
//        response.put("id", null);
//        response.put("payload", null);
//        return response;
//    }
//}
