/*
Nicholas O'Sullivan
Test CreateSheet API, in/output focused.
 */

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;


public class TestCreateSheetAPI {

    @Mock
    private CreateSheet createSheetInstance;

    private CreateSheetAPI createSheetAPI;

    //set up test environment
    //set up mock + api
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        //createSheetAPI = new CreateSheetAPI(createSheetInstance);
    }

    //tear down environment after each test
    @AfterEach
    public void tearDown() throws Exception {
        closeable.close(); //close everything started in the @BeforeEach call(s).
    }

    @Test
    public void testGetResponse() {
        // Arrange
        String input = "CreateSheetAPIJsonRequest";
        String expectedOutput = "Correct";
        when(createSheetInstance.processInput(input)).thenReturn(expectedOutput);

        // Act
        String actualOutput = createSheetAPI.getResponse(input);

        // Assert
        assertEquals(expectedOutput, actualOutput);
        verify(createSheetInstance, times(1)).processInput(input);
    }
}
