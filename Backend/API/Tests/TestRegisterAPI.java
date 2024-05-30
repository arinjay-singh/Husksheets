/*
Nicholas O'Sullivan
Test Register API, in/output focused.
 */
package API.Tests;
import static org.mockito.Mockito.*;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;



public class TestRegisterAPI {

    @Mock
    private Register registerUserInstance;
    private RegisterAPI regAPI;

    //set up test environment
    //set up mock + api
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        //regAPI = new RegisterAPI(registerUserInstance);
    }

    //tear down environment after each test
    @AfterEach
    public void tearDown() throws Exception {
        closeable.close(); //close everything started in the @BeforeEach call(s).
    }

    @Test
    public void testGetResponse() {
        // Arrange
        String input = "registerApiJson";
        String expectedOutput = "Correct";
        when(registerUserInstance.processInput(input)).thenReturn(expectedOutput);

        // Act
        String actualOutput = regAPI.getResponse(input);

        // Assert
        assertEquals(expectedOutput, actualOutput);
        verify(registerUserInstance, times(1)).processInput(input);
    }
}
