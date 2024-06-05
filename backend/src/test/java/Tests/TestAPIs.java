package Tests;

import Tests.Utils.Constants;
import Tests.Utils.TestAPIHelpers;
import com.husksheets_api_server_scrumlords.Helpers.RegisterUserService;
import com.husksheets_api_server_scrumlords.config.SpringSecurityConfig;
import com.husksheets_api_server_scrumlords.controllers.RegisterController;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Value;
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
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.ArrayList;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TestRegister API
 * author: Nicholas O'Sullivan
 */

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = RegisterController.class)
@ContextConfiguration(classes = {RegisterController.class, RegisterUserService.class, SpringSecurityConfig.class})
public class TestAPIs {

    @Autowired
    public MockMvc mockMvc;

    @MockBean
    private RegisterUserService registerUserService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        Publishers.getInstance().getPublisherMap().clear(); // Reset the shared data store before each test
    }

    @Test
    public void testAPIs() throws Exception {
        mockRegisterService();

        ArrayList<Value> publishers = new ArrayList<>();
        Response getPublishersResponse = new Response(true, null);

        // Test get publishers when no publishers registered.
        testNoAuth(Constants.getPublishersRequest);
        testGetPublishersAPI(getPublishersResponse, Constants.getPublishersRequest, Constants.team5username, Constants.team5password);

        // Register publisher 1
        testNoAuth(Constants.registerRequest);
        testRegisterAPI(Constants.registerRequest, Constants.team5username, Constants.team5password);

        publishers.addFirst(Constants.Team5PublisherNoDocsValue);
        getPublishersResponse.setValues(publishers);
        System.out.println("Publishers after registering Team5: " + publishers);

        // Get publishers with 1 publisher registered
        testGetPublishersAPI(getPublishersResponse, Constants.getPublishersRequest, Constants.team5username, Constants.team5password);

        // Register publisher 2
        testNoAuth(Constants.registerRequest);
        testRegisterAPI(Constants.registerRequest, Constants.mikeUsername, Constants.mikePassword);

        publishers.addFirst(Constants.MikePublisherNoDocsValue);
        getPublishersResponse.setValues(publishers);
        System.out.println("Publishers after registering Mike: " + publishers);

        // Get publishers with 2 publishers registered
        testGetPublishersAPI(getPublishersResponse, Constants.getPublishersRequest, Constants.team5username, Constants.team5password);
    }

    public void testRegisterAPI(String request, String username, String password) throws Exception {
        ResultActions resultActions = TestAPIHelpers.performGetRequestWithBasicAuth(mockMvc, request, username, password);
        TestAPIHelpers.assertResponse(resultActions, Constants.registerResponseSuccess);
    }

    private void mockRegisterService() {
    BDDMockito.given(registerUserService.register(ArgumentMatchers.anyString())).willAnswer(invocation -> {
        String username = invocation.getArgument(0);
        System.out.println("Registering publisher with username: \"" + username + "\"");
        Publishers.getInstance().addNewPublisher(username);
        return Constants.registerResponseSuccess;
    });
}
   // private void mockGetPublishersService

    public void testGetPublishersAPI(Response expectedResponse, String request, String username, String password) throws Exception {
        ResultActions resultActions = TestAPIHelpers.performGetRequestWithBasicAuth(mockMvc, request, username, password);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }

    public void testNoAuth(String url) throws Exception {
        String noAuthExpectedOutput = Constants.unauthorizedResponse;
        ResultActions resultActions = TestAPIHelpers.performGetRequestNoAuth(mockMvc, url);
        resultActions.andExpect(status().isUnauthorized()).andExpect(content().string(noAuthExpectedOutput));
    }
}