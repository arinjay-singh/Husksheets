package Tests;

/*
Nicholas O'Sullivan
Test GetPublishers API, in/output focused.
 */

import static org.mockito.Mockito.*;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;



public class TestGetPublishersAPI {

    @Mock
    private GetPublishers getPublishersInstance;

    private GetPublishersAPI getPublishersAPI;

    //set up test environment
    //set up mock + api
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        //getPublishersAPI = new getPublishersAPI(getPublishersInstance);
    }

    //tear down environment after each test
    @AfterEach
    public void tearDown() throws Exception {
        closeable.close(); //close everything started in the @BeforeEach call(s).
    }

    @Test
    public void testGetResponse() {
        // Arrange
        String input = "GetPublishersAPIJsonRequest";
        String expectedOutput = "Correct";
        when(getPublishersInstance.processInput(input)).thenReturn(expectedOutput);

        // Act
        String actualOutput = getPublishersAPI.getResponse(input);

        // Assert
        assertEquals(expectedOutput, actualOutput);
        verify(getPublishersInstance, times(1)).processInput(input);
    }
}
