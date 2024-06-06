package Tests;

import Tests.utils.Constants;
import Tests.utils.TestAPIHelpers;
import com.husksheets_api_server_scrumlords.controllers.UpdateController;
import com.husksheets_api_server_scrumlords.models.*;
import com.husksheets_api_server_scrumlords.requests.CreateSheetRequest;
import com.husksheets_api_server_scrumlords.requests.DeleteSheetRequest;
import com.husksheets_api_server_scrumlords.requests.GetSheetsRequest;
import com.husksheets_api_server_scrumlords.services.*;
import com.husksheets_api_server_scrumlords.config.SpringSecurityConfig;
import com.husksheets_api_server_scrumlords.controllers.RegisterController;
import com.husksheets_api_server_scrumlords.controllers.SheetController;
import com.fasterxml.jackson.databind.ObjectMapper;

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

import java.util.ArrayList;
import java.util.Base64;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test API layer functionality
 * author: Nicholas O'Sullivan and Kaan Tural
 */

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = {RegisterController.class, SheetController.class})
@ContextConfiguration(classes = {RegisterController.class,
        SheetController.class,
        RegisterUserService.class,
        GetPublishersService.class,
        CreateSheetService.class,
        DeleteSheetService.class,
        GetSheetsService.class,
        SpringSecurityConfig.class})

public class TestAPIs {

    @Autowired
    public MockMvc mockMvc;

    @MockBean
    private RegisterUserService registerUserService;
    @MockBean
    private CreateSheetService createSheetService;
    @MockBean
    private DeleteSheetService deleteSheetService;
    @MockBean
    private GetSheetsService getSheetsService;

    /**
     * Set up the test environment before each test, clears the shared data store and opens a Mockito mock.
     */
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        Publishers.getInstance().getPublisherMap().clear();
        mockRegisterService();
        mockCreateSheetService();
        mockDeleteSheetService();
        mockGetSheetsService();
    }


    /**
     * Test the Register API and Get Publishers API for none to multiple publishers with and without authentication.
     *
     * @throws Exception if an expected value - isUnauthorized - value doesn't match the expected typing.
     */
    @Test
    public void testAPIs() throws Exception {
        ArrayList<Value> publishers = new ArrayList<>();
        Response successResponse = new Response(true, null);
        Response errorResponse = new Response(false, null);

        // Test get publishers when no publishers registered.
        testNoAuth(Constants.getPublishersRequest);
        testGetPublishersAPI(successResponse, Constants.getPublishersRequest,
                Constants.team5username, Constants.team5password);

        // Register publisher 1
        registerPublisherHelper(publishers, successResponse, Constants.team5username,
                Constants.team5password, Constants.Team5PublisherNoDocsValue);

        // Get publishers with 1 publisher registered
        testGetPublishersAPI(successResponse, Constants.getPublishersRequest,
                Constants.team5username, Constants.team5password);

        // Register publisher 2
        registerPublisherHelper(publishers, successResponse, Constants.mikeUsername,
                Constants.mikePassword, Constants.MikePublisherNoDocsValue);

        // Get publishers with 2 publishers registered
        testGetPublishersAPI(successResponse, Constants.getPublishersRequest,
                Constants.team5username, Constants.team5password);


        // Team5 createSheet: sheet1
        testCreateSheetAPI(Constants.createSheetResponseSuccess, Constants.createSheetRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet1");

        // ERROR: Team5 createSheet w/ non-existent publisher
        testCreateSheetAPI(Constants.createSheetForOtherPublisherResponseError, Constants.createSheetRequest,
                Constants.team5username, Constants.team5password, "team4", "Sheet1");

        // ERROR: Team5 createSheet w/ other publisher
        testCreateSheetAPI(Constants.createSheetForOtherPublisherResponseError, Constants.createSheetRequest,
                Constants.team5username, Constants.team5password, Constants.mikeUsername, "Sheet1");

        // ERROR: team5 Duplicate createSheet w/ Correct Publisher team5
        testCreateSheetAPI(new Response(false, "Sheet already exists: Sheet1"), Constants.createSheetRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet1");

        // Team5 createSheet: sheet2
        testCreateSheetAPI(Constants.createSheetResponseSuccess, Constants.createSheetRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet2");

        // Mike createSheet: mikesheet
        testCreateSheetAPI(Constants.createSheetResponseSuccess, Constants.createSheetRequest,
                Constants.mikeUsername, Constants.mikePassword, Constants.mikeUsername, "mikesheet");

        // Team5 getSheets from Team5
        testGetSheetsAPI(Constants.getSheetsResponseSuccess, Constants.getSheetsRequest,
                Constants.team5username, Constants.team5password, Constants.team5username);
        // Team5 getSheets from Mike
        testGetSheetsAPI(Constants.getSheetsResponseSuccess, Constants.getSheetsRequest,
                Constants.team5username, Constants.team5password, Constants.mikeUsername);

        //ERROR: team5 getSheets from non-existent user.
        testGetSheetsAPI(new Response(false, "Publisher not found: Jason"), Constants.getSheetsRequest,
                Constants.team5username, Constants.team5password, "Jason");

        //team5 deleteSheet w/ Correct publisher: Team5
        testDeleteSheetAPI(Constants.deleteSheetResponseSuccess, Constants.deleteSheetRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet1");

        // ERROR: team5 deleteSheet w/ Correct Publisher Team5 but non-existent sheet
        testDeleteSheetAPI(Constants.deleteSheetResponseError, Constants.deleteSheetRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "SheetDNE");

        // ERROR: team5 deleteSheet w/ incorrect publisher
        testDeleteSheetAPI(new Response(false, "Unauthorized: sender is not owner of sheet"), Constants.deleteSheetRequest,
                Constants.team5username, Constants.team5password, Constants.mikeUsername, "Sheet2");

        // ERROR: team5 deleteSheet w/ non-existent Publisher
        testDeleteSheetAPI(new Response(false, "Unauthorized: sender is not owner of sheet"), Constants.deleteSheetRequest,
                Constants.team5username, Constants.team5password, "UserDNE", "Sheet2");



    }

    /**
     * Helper method to register a publisher and update the publishers list.
     *
     * @param publishers            List of values which contain the publishers.
     * @param getPublishersResponse Response object to update the publishers list.
     * @param username              Username of the publisher to register.
     * @param password              Password of the publisher to register.
     * @param noDocsValue           Value object with all null fields aside from publisher.
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

    public void testCreateSheetAPI(Response expectedResponse, String request, String username,
                                   String password, String requestedPublisher, String sheetName) throws Exception {
        CreateSheetRequest createSheetRequestBody = new CreateSheetRequest();
        createSheetRequestBody.setSheet(sheetName);
        createSheetRequestBody.setPublisher(requestedPublisher);
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBodyJson = objectMapper.writeValueAsString(createSheetRequestBody);
        ResultActions resultActions = TestAPIHelpers.performPostRequestWithBasicAuthBody(mockMvc, request, username, password, requestBodyJson);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }

    public void testGetSheetsAPI(Response expectedResponse, String request, String username,
                                 String password, String requestedPublisher) throws Exception {
        GetSheetsRequest getSheetsRequestBody = new GetSheetsRequest();
        getSheetsRequestBody.setPublisher(requestedPublisher);
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBodyJson = objectMapper.writeValueAsString(getSheetsRequestBody);
        ResultActions resultActions = TestAPIHelpers.performPostRequestWithBasicAuthBody(mockMvc, request, username, password, requestBodyJson);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }

    public void testDeleteSheetAPI(Response expectedResponse, String request, String username,
                                   String password, String requestedPublisher, String sheetName) throws Exception {
        DeleteSheetRequest deleteSheetRequestBody = new DeleteSheetRequest();
        deleteSheetRequestBody.setSheet(sheetName);
        deleteSheetRequestBody.setPublisher(requestedPublisher);
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBodyJson = objectMapper.writeValueAsString(deleteSheetRequestBody);
        ResultActions resultActions = TestAPIHelpers.performPostRequestWithBasicAuthBody(mockMvc, request, username, password, requestBodyJson);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }


    /**
     * Test any API, expecting the server to return an unauthorized response.
     *
     * @param url the route
     * @throws Exception if an expected value - unauthorizedResponse - value doesn't match the expected typing.
     */
    public void testNoAuth(String url) throws Exception {
        String noAuthExpectedOutput = Constants.unauthorizedResponse;
        ResultActions resultActions = TestAPIHelpers.performGetRequestNoAuth(mockMvc, url);
        resultActions.andExpect(status().isUnauthorized()).andExpect(content().string(noAuthExpectedOutput));
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

    private void mockCreateSheetService() {
        BDDMockito.given(createSheetService.createSheet(any(Publisher.class), ArgumentMatchers.anyString())).willAnswer(invocation -> {
            Publisher requestedPublisher = invocation.getArgument(0);
            String sheetName = invocation.getArgument(1);

            Publisher publisher = Publishers.getInstance().getPublisher(requestedPublisher.getName());
            if (publisher == null) { //not valid publisher
                return Constants.createSheetForOtherPublisherResponseError;
            } else if (publisher.hasSheet(invocation.getArgument(1))) { //already exists
                return new Response(false, String.format("Sheet already exists: %s", sheetName));
            } else {
                publisher.addSheet(new Sheet(invocation.getArgument(1), publisher.getName()));
                return Constants.createSheetResponseSuccess;
            }
        });

    }

    private void mockDeleteSheetService() {
        BDDMockito.given(deleteSheetService.deleteSheet(any(Publisher.class), ArgumentMatchers.anyString())).willAnswer(invocation -> {
            Publisher requestedPublisher = invocation.getArgument(0);
            Publisher publisher = Publishers.getInstance().getPublisher(requestedPublisher.getName());
            if (publisher != null && publisher.hasSheet(invocation.getArgument(1)))
                return Constants.deleteSheetResponseSuccess;
            else {
                return Constants.deleteSheetResponseError;
            }
        });
    }


    private void mockGetSheetsService() {
        BDDMockito.given(getSheetsService.getSheets(any(Publisher.class))).willAnswer(invocation -> {
            Publisher publisher = invocation.getArgument(0);
            if (Publishers.getInstance().getPublisher(publisher.getName()) != null)
                return Constants.getSheetsResponseSuccess;
            else {
                return Constants.getSheetsResponseError;
            }
        });
    }
}