package Tests;
import com.husksheets_api_server_scrumlords.Services.Register.RegisterUserService;
import com.husksheets_api_server_scrumlords.config.SpringSecurityConfig;
import com.husksheets_api_server_scrumlords.controllers.RegisterController;
import com.husksheets_api_server_scrumlords.models.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.BDDMockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import java.util.Base64;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * TestRegister API
 * author: Nicholas O'Sullivan
 */

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = RegisterController.class)
@ContextConfiguration(classes = {RegisterController.class, RegisterUserService.class, SpringSecurityConfig.class})
public class TestRegisterAPI {

    //instead of this moving forward we shoud set a for loop to test two random users from our future userLogins enum
    String username = "Team5";
    String password = "5password";
    String request = "/api/v1/register"; //same with this request thing we should abstract it

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private RegisterUserService registerUserService;
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //main test template
     @Test
    public void testGetResponse() throws Exception {

        Response expectedOutput = new Response(true, null); //set up register mock
        mockRegisterService(expectedOutput);
        //trigger request
        ResultActions resultActions = performGetRequestWithBasicAuth(request, username, password);
        assertResponse(resultActions, expectedOutput);  //compare output
    }

    private void mockRegisterService(Response expectedOutput) {
        BDDMockito.given(registerUserService.register(ArgumentMatchers.anyString())).willReturn(expectedOutput);
    }

    // do a GET request w/ Basic Auth
    private ResultActions performGetRequestWithBasicAuth(String url, String username, String password) throws Exception {

        String auth = username + ":" + password;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
        return mockMvc.perform(MockMvcRequestBuilders.get(url)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth));
    }

    //compare actual vs/ expected
    private void assertResponse(ResultActions resultActions, Response expectedOutput) throws Exception {

        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(expectedOutput.isSuccess()))
                .andExpect(jsonPath("$.message").value(expectedOutput.getMessage()))
                .andExpect(jsonPath("$.values").isArray())
                .andExpect(jsonPath("$.time").exists());
    }


    /*
    Test register API failure when no authentication sent.
     */
    @Test
    public void testNoAuth() throws Exception {

        Response expectedOutput = new Response(false, null); //set up register mock
        mockRegisterService(expectedOutput);
        //trigger request
        ResultActions resultActions = performGetRequestNoAuth(request, username, password);
        assertResponse(resultActions, expectedOutput);  //compare output
    }


    // do a GET request w/o Basic Auth
    private ResultActions performGetRequestNoAuth(String url, String username, String password) throws Exception {
        return mockMvc.perform(MockMvcRequestBuilders.get(url));
    }
}