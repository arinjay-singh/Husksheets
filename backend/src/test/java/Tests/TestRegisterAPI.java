/*
Nicholas O'Sullivan
Test Register API, in/output focused.
 */
package Tests;
import static org.mockito.Mockito.*;

import com.husksheets_api_server_scrumlords.Services.Register.RegisterUserService;
import com.husksheets_api_server_scrumlords.controllers.RegisterController;
import com.husksheets_api_server_scrumlords.models.Response;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;



public class TestRegisterAPI {

    @Mock
    private RegisterUserService registerUserService;
    private RegisterController registerController;
    private AutoCloseable closeable; //store closeable mock

    //set up test environment
    //set up mock + api
    @BeforeEach
    public void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
        registerController = new RegisterController(registerUserService);
    }

    //tear down environment after each test
    @AfterEach
    public void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    public void testGetResponse() {
        // Arrange
        String username = "team5";
        Response expectedOutput = new Response(true, null);
      //  when(registerUserService.register(username)).thenReturn(expectedOutput);

        //I dont think we can test outer API shell from java without implementing a pipeline
        //involving http tests.

       // Response actualOutput = registerController.();
       // assertEquals(expectedOutput, actualOutput);
        verify(registerUserService, times(1)).register(username);
    }
}
