//package Tests;
//
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.BeforeEach;
//import org.mockito.Mock;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
//import static org.mockito.Mockito.doNothing;
//
//public class TestDeleteSheetAPI {
//
//    @Mock
//    private GetSheetsAPI getSheetsAPI;
//
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
//    public void testDeleteSheetResponse() {
//        Map<String, String> argument = new HashMap<>();
//        argument.put("publisher", "alice");
//        argument.put("sheet", "Sheet1");
//
//        doNothing().when(getSheetsAPI).deleteSheet(argument);
//
//        assertDoesNotThrow(() -> getSheetsAPI.deleteSheet(argument));
//    }
//}
