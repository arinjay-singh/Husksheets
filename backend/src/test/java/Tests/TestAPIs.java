package Tests;

import Tests.utils.Constants;
import Tests.utils.TestAPIHelpers;
import com.husksheets_api_server_scrumlords.services.GetPublishersService;
import com.husksheets_api_server_scrumlords.services.RegisterUserService;
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
 * author: Nicholas O'Sullivan and Kaan Tural
 */

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = RegisterController.class)
@ContextConfiguration(classes = {RegisterController.class, RegisterUserService.class, GetPublishersService.class, SpringSecurityConfig.class})
public class TestAPIs {

    @Autowired
    public MockMvc mockMvc;

    @MockBean
    private RegisterUserService registerUserService;

    /**
     * Set up the test environment before each test, clears the shared data store and opens a Mockito mock.
     */
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        Publishers.getInstance().getPublisherMap().clear();
        mockRegisterService();
    }

    /**
     * Test the Register API and Get Publishers API for none to multiple publishers with and without authentication.
     *
     * @throws Exception if an expected value - isUnauthorized - value doesn't match the expected typing.
     */
    @Test
    public void testAPIs() throws Exception {
        ArrayList<Value> publishers = new ArrayList<>();
        Response getPublishersResponse = new Response(true, null);

        // Test get publishers when no publishers registered.
        testNoAuth(Constants.getPublishersRequest);
        testGetPublishersAPI(getPublishersResponse, Constants.getPublishersRequest,
                Constants.team5username, Constants.team5password);

        // Register publisher 1
        registerPublisherHelper(publishers, getPublishersResponse, Constants.team5username,
                Constants.team5password, Constants.Team5PublisherNoDocsValue);

        // Get publishers with 1 publisher registered
        testGetPublishersAPI(getPublishersResponse, Constants.getPublishersRequest,
                Constants.team5username, Constants.team5password);

        // Register publisher 2
        registerPublisherHelper(publishers, getPublishersResponse, Constants.mikeUsername,
                Constants.mikePassword, Constants.MikePublisherNoDocsValue);

        // Get publishers with 2 publishers registered
        testGetPublishersAPI(getPublishersResponse, Constants.getPublishersRequest,
                Constants.team5username, Constants.team5password);
    }

    /**
     * Helper method to register a publisher and update the publishers list.
     *
     * @param publishers List of values which contain the publishers.
     * @param getPublishersResponse Response object to update the publishers list.
     * @param username Username of the publisher to register.
     * @param password Password of the publisher to register.
     * @param noDocsValue Value object with all null fields aside from publisher.
     */
    public void registerPublisherHelper(ArrayList<Value> publishers, Response getPublishersResponse,
                                        String username, String password, Value noDocsValue) {
        try {
            testNoAuth(Constants.registerRequest);
            testRegisterAPI(Constants.registerRequest, username, password);
        } catch (Exception e) {
            e.printStackTrace();
        }

        publishers.addFirst(noDocsValue);
        getPublishersResponse.setValues(publishers);
        System.out.printf("Publishers after registering %s: %s%n", username, publishers);
    }

    /**
     * Test the Register API, expecting the server to return a success response.
     *
     * @param request  the request to register a publisher.
     * @param username the username of the publisher to register.
     * @param password the password of the publisher to register.
     * @throws Exception if an expected value - BasicAuthentication - value doesn't match the expected typing.
     */
    public void testRegisterAPI(String request, String username, String password) throws Exception {
        ResultActions resultActions = TestAPIHelpers
                .performGetRequestWithBasicAuth(mockMvc, request, username, password);
        TestAPIHelpers.assertResponse(resultActions, Constants.registerResponseSuccess);
    }

    /**
     * Mock the Register Service to simulate the registration of a publisher, allows values to be added to the
     * shared data store.
     */
    private void mockRegisterService() {
        BDDMockito.given(registerUserService.register(ArgumentMatchers.anyString())).willAnswer(invocation -> {
            String username = invocation.getArgument(0);
            System.out.println("Registering publisher with username: \"" + username + "\"");
            Publishers.getInstance().addNewPublisher(username);
            return Constants.registerResponseSuccess;
        });
    }

    /**
     * Test the Get Publishers API, expecting the server to return a success response with the given publishers in
     * expectedResponse after an API call.
     *
     * @param expectedResponse the expected response from the server with added publishers.
     * @param request          the request to get publishers.
     * @param username         the username of the user making the request.
     * @param password         the password of the user making the request.
     * @throws Exception if an expected value - BasicAuthentication - value doesn't match the expected typing.
     */
    public void testGetPublishersAPI(Response expectedResponse, String request, String username, String password) throws Exception {
        ResultActions resultActions = TestAPIHelpers.performGetRequestWithBasicAuth(mockMvc, request, username, password);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }

    /**
     * Test the Get Publishers API, expecting the server to return an unauthorized response.
     *
     * @param url the route to getPublishers.
     * @throws Exception if an expected value - unauthorizedResponse - value doesn't match the expected typing.
     */
    public void testNoAuth(String url) throws Exception {
        String noAuthExpectedOutput = Constants.unauthorizedResponse;
        ResultActions resultActions = TestAPIHelpers.performGetRequestNoAuth(mockMvc, url);
        resultActions.andExpect(status().isUnauthorized()).andExpect(content().string(noAuthExpectedOutput));
    }
}