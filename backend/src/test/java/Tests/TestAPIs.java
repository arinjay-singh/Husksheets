package Tests;

import Tests.utils.Constants;
import Tests.utils.TestAPIHelpers;
import com.husksheets_api_server_scrumlords.controllers.UpdateController;
import com.husksheets_api_server_scrumlords.models.*;
import com.husksheets_api_server_scrumlords.requests.*;
import com.husksheets_api_server_scrumlords.serialize.SerializationUtil;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test API layer functionality
 */

/**
 * Class Setup + Mockito + Bean/Context setup:
 * @author Nicholas O'Sullivan
 */
@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = {RegisterController.class, SheetController.class, UpdateController.class})
@ContextConfiguration(classes = {RegisterController.class,
        SheetController.class,
        RegisterUserService.class,
        GetPublishersService.class,
        CreateSheetService.class,
        DeleteSheetService.class,
        GetSheetsService.class,
        UpdateController.class,
        GetUpdatesService.class,
        UpdatePublishedService.class,
        UpdateSubscriptionService.class,
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
    @MockBean
    private GetUpdatesService getUpdatesService;
    @MockBean
    private UpdatePublishedService updatePublishedService;
    @MockBean
    private UpdateSubscriptionService updateSubscriptionService;

    /**
     * Set up the test environment before each test, clears the shared data store and opens a Mockito mock.
     */
    @BeforeEach
    public void setUp() {
        SerializationUtil.clearSerializedData("publishers.ser");
        MockitoAnnotations.openMocks(this);
        Publishers.getInstance().getPublisherMap().clear();
        mockRegisterService();
        mockCreateSheetService();
        mockDeleteSheetService();
        mockGetSheetsService();
        mockGetUpdatesService();
        mockUpdatePublishedService();
        mockUpdateSubscriptionService();
    }


    /**
     * Test the Register API and Get Publishers API for none to multiple publishers with and without authentication.
     * @author register/getpublishers, 'sheets' tests: Nicholas O'Sullivan
     * @author all 'Updates' tests, refactoring: Kaan Tural
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

        // Successful updatePublished
        testUpdatePublishedAPI(Constants.updatePublishedResponseSuccess, Constants.updatePublishedRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet1", "aaa");

        // Attempting updatePublished with empty payload and empty sheet
        testUpdatePublishedAPI(Constants.updateSheetNotFound, Constants.updatePublishedRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "", "");

        // Attempting updatePublished with empty payload
        testUpdatePublishedAPI(Constants.updatePublishedResponseSuccess, Constants.updatePublishedRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet1", "");

        // Team5 tries to use getUpdatesForPublished on Mike's sheet
        testUpdatePublishedAPI(Constants.publisherNotOwnerError, Constants.updatePublishedRequest,
                Constants.team5username, Constants.team5password, Constants.mikeUsername, "MikeSheet", "bbb");

        // Successful updateSubscription
        testUpdateSubscriptionAPI(Constants.updateSubscriptionResponseSuccess, Constants.updateSubscriptionRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet1", "aaa");

        // Attempting updateSubscription with empty payload and empty sheet
        testUpdateSubscriptionAPI(Constants.updateSheetNotFound, Constants.updateSubscriptionRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "", "");

        // Attempting updateSubscription with empty payload
        testUpdateSubscriptionAPI(Constants.updateSubscriptionResponseSuccess, Constants.updateSubscriptionRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet1", "");

        // Mike successfully uses updateSubscription to Team5's Sheet
        testUpdateSubscriptionAPI(Constants.updateSubscriptionResponseSuccess, Constants.updateSubscriptionRequest,
                Constants.mikeUsername, Constants.mikePassword, Constants.team5username, "Sheet1", "$A1 51.0\n$B2 \"Bing Bong\"");

        // Successful getUpdatesForSubscription
        testGetUpdatesForSubscriptionAPI(Constants.getUpdatesForSubscriptionResponseSuccess, Constants.getUpdatesForSubscriptionRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet1", "0");

        // Successful getUpdatesForPublished
        testGetUpdatesForPublishedAPI(Constants.getUpdatesForPublishedResponseSuccess, Constants.getUpdatesForPublishedRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet1", "1");

        // Team5 tries to use getUpdatesForPublished on Mike's sheet
        testGetUpdatesForPublishedAPI(Constants.publisherNotOwnerError, Constants.getUpdatesForPublishedRequest,
                Constants.team5username, Constants.team5password, Constants.mikeUsername, "MikeSheet", "0");

        // Attempting getUpdatesForPublished on a non-existent sheet
        testGetUpdatesForPublishedAPI(Constants.getSheetsResponseError2, Constants.getUpdatesForPublishedRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "MikeTypeSheet", "0");

        // Attempting getUpdatesForPublished with a non-existent id
        testGetUpdatesForPublishedAPI(Constants.getUpdatesForPublishedResponseSuccess, Constants.getUpdatesForPublishedRequest,
                Constants.team5username, Constants.team5password, Constants.team5username, "Sheet1", "10");

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
     * @author Kaan Tural
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
        getPublishersResponse.setValue(publishers);
        System.out.printf("Publishers after registering %s: %s%n", username, publishers);
    }

    /**
     * Test the Register API, expecting the server to return a success response.
     * @author Nicholas O'Sullivan
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
     * @author Nicholas O'Sullivan
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
     * Test the Create Sheet API
     * @author Nicholas O'Sullivan
     */
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

    /**
     * Test the Get Sheets API
     * @author Nicholas O'Sullivan
     */
    public void testGetSheetsAPI(Response expectedResponse, String request, String username,
                                 String password, String requestedPublisher) throws Exception {
        GetSheetsRequest getSheetsRequestBody = new GetSheetsRequest();
        getSheetsRequestBody.setPublisher(requestedPublisher);
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBodyJson = objectMapper.writeValueAsString(getSheetsRequestBody);
        ResultActions resultActions = TestAPIHelpers.performPostRequestWithBasicAuthBody(mockMvc, request, username, password, requestBodyJson);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }

    /**
     * Test the Delete Sheet API
     * @author Nicholas O'Sullivan
     */
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
     * Test the Update Published API
     * @author Kaan Tural
     */
    public void testUpdatePublishedAPI(Response expectedResponse, String request, String username,
                                       String password, String requestedPublisher, String sheetName, String payload) throws Exception {
        UpdateRequest updateRequestBody = new UpdateRequest();
        updateRequestBody.setPublisher(requestedPublisher);
        updateRequestBody.setSheet(sheetName);
        updateRequestBody.setPayload(payload);
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBodyJson = objectMapper.writeValueAsString(updateRequestBody);
        ResultActions resultActions = TestAPIHelpers.performPostRequestWithBasicAuthBody(mockMvc, request, username, password, requestBodyJson);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }

    /**
     * Test the Update Subscription API
     * @author Kaan Tural
     */
    public void testUpdateSubscriptionAPI(Response expectedResponse, String request, String username,
                                          String password, String requestedPublisher, String sheetName, String payload) throws Exception {
        UpdateRequest updateRequestBody = new UpdateRequest();
        updateRequestBody.setPublisher(requestedPublisher);
        updateRequestBody.setSheet(sheetName);
        updateRequestBody.setPayload(payload);
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBodyJson = objectMapper.writeValueAsString(updateRequestBody);
        ResultActions resultActions = TestAPIHelpers.performPostRequestWithBasicAuthBody(mockMvc, request, username, password, requestBodyJson);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }

    /**
     * Test the Get Updates For Subscription API
     * @author Kaan Tural
     */
    public void testGetUpdatesForSubscriptionAPI(Response expectedResponse, String request, String username,
                                                 String password, String requestedPublisher, String sheetName, String id) throws Exception {
        GetUpdatesRequest getUpdatesRequestBody = new GetUpdatesRequest();
        getUpdatesRequestBody.setPublisher(requestedPublisher);
        getUpdatesRequestBody.setSheet(sheetName);
        getUpdatesRequestBody.setId(id);
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBodyJson = objectMapper.writeValueAsString(getUpdatesRequestBody);
        ResultActions resultActions = TestAPIHelpers.performPostRequestWithBasicAuthBody(mockMvc, request, username, password, requestBodyJson);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }

    /**
     * Test the Get Updates for Published API
     * @author Kaan Tural
     */
    public void testGetUpdatesForPublishedAPI(Response expectedResponse, String request, String username,
                                              String password, String requestedPublisher, String sheetName, String id) throws Exception {
        GetUpdatesRequest getUpdatesRequestBody = new GetUpdatesRequest();
        getUpdatesRequestBody.setPublisher(requestedPublisher);
        getUpdatesRequestBody.setSheet(sheetName);
        getUpdatesRequestBody.setId(id);
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBodyJson = objectMapper.writeValueAsString(getUpdatesRequestBody);
        ResultActions resultActions = TestAPIHelpers.performPostRequestWithBasicAuthBody(mockMvc, request, username, password, requestBodyJson);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }

    /**
     * Test any API, expecting the server to return an unauthorized response.
     * @author Nicholas O'Sullivan
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
     * @author Nicholas O'Sullivan, Kaan Tural
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
     * Mock the create Sheet service.
     * @author Nicholas O'Sullivan
     */
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

    /**
     * Mock the delete Sheet service.
     * @author Nicholas O'Sullivan
     */
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


    /**
     * Mock the get sheets service.
     * @author Nicholas O'Sullivan
     */
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

   /**
     * Mock the get updates service.
     * @author Kaan Tural
     */
    private void mockGetUpdatesService() {
        // Mock for SUBSCRIPTION updates
        BDDMockito.given(getUpdatesService.getUpdates(
                        ArgumentMatchers.anyString(),
                        ArgumentMatchers.anyString(),
                        ArgumentMatchers.anyString(),
                        argThat(argument -> argument == GetUpdatesService.UpdateType.SUBSCRIPTION)))
                .willAnswer(invocation -> {
                    String requestPublisher = invocation.getArgument(0);
                    String requestSheet = invocation.getArgument(1);
                    String id = invocation.getArgument(2);
                    GetUpdatesService.UpdateType updateType = invocation.getArgument(3);

                    Map<Sheet, Response> validationResponse = ValidationUtils.validatePublisherAndSheet(
                            requestPublisher, requestSheet);
                    if (validationResponse.containsKey(null)) {
                        return validationResponse.get(null);
                    }

                    Response idValidationResponse = ValidationUtils.validateId(id);
                    if (!idValidationResponse.isSuccess()) {
                        return idValidationResponse;
                    }
                    int idInt = Integer.parseInt(id);

                    Sheet userSheet = validationResponse.keySet().iterator().next();
                    String payload = userSheet.getUpdatesForSubscriptionAfterGivenID(idInt);
                    Value returnValue = new Value(requestPublisher, requestSheet, userSheet.getLatestUpdateID(), payload);
                    ArrayList<Value> returnValues = new ArrayList<>();
                    returnValues.add(returnValue);

                    Response returnResponse = new Response(true, null);
                    returnResponse.setValue(returnValues);
                    return returnResponse;
                });

        // Mock for PUBLISHED updates
        BDDMockito.given(getUpdatesService.getUpdates(
                        ArgumentMatchers.anyString(),
                        ArgumentMatchers.anyString(),
                        ArgumentMatchers.anyString(),
                        argThat(argument -> argument == GetUpdatesService.UpdateType.PUBLISHED)))
                .willAnswer(invocation -> {
                    String requestPublisher = invocation.getArgument(0);
                    String requestSheet = invocation.getArgument(1);
                    String id = invocation.getArgument(2);
                    GetUpdatesService.UpdateType updateType = invocation.getArgument(3);

                    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                    String username = auth.getName();
                    if (!requestPublisher.equals(username)) {
                        return new Response(false, "Unauthorized: sender is not owner of sheet");
                    }

                    Map<Sheet, Response> validationResponse = ValidationUtils.validatePublisherAndSheet(
                            requestPublisher, requestSheet);
                    if (validationResponse.containsKey(null)) {
                        return validationResponse.get(null);
                    }

                    Response idValidationResponse = ValidationUtils.validateId(id);
                    if (!idValidationResponse.isSuccess()) {
                        return idValidationResponse;
                    }
                    int idInt = Integer.parseInt(id);

                    Sheet userSheet = validationResponse.keySet().iterator().next();
                    String payload = userSheet.getUpdatesForPublishedAfterGivenID(idInt);
                    Value returnValue = new Value(requestPublisher, requestSheet, userSheet.getLatestUpdateID(), payload);
                    ArrayList<Value> returnValues = new ArrayList<>();
                    returnValues.add(returnValue);

                    Response returnResponse = new Response(true, null);
                    returnResponse.setValue(returnValues);
                    return returnResponse;
                });
    }


   /**
     * Mock the update published service.
     * @author Kaan Tural
     */
    private void mockUpdatePublishedService() {
        BDDMockito.given(updatePublishedService.updatePublished(
                        ArgumentMatchers.anyString(),
                        ArgumentMatchers.anyString(),
                        ArgumentMatchers.anyString()))
                .willAnswer(invocation -> {
                    String requestPublisher = invocation.getArgument(0);
                    String requestSheet = invocation.getArgument(1);
                    String requestPayload = invocation.getArgument(2);

                    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                    String username = auth.getName();
                    if (!requestPublisher.equals(username)) {
                        return new Response(false, "Unauthorized: sender is not owner of sheet");
                    }
                    Map<Sheet, Response> validationResponse = ValidationUtils.validatePublisherAndSheet(
                            requestPublisher, requestSheet);
                    if (validationResponse.containsKey(null)) {
                        return validationResponse.get(null);
                    }
                    Response payloadValidationResponse = ValidationUtils.validatePayload(requestPayload);
                    if (!payloadValidationResponse.isSuccess()) {
                        return payloadValidationResponse;
                    }
                    Sheet userSheet = validationResponse.keySet().iterator().next();
                    userSheet.addNewUpdateSubscription(requestPayload);
                    return new Response(true, null);
                });
    }

    /**
     * Mock the update subscription service.
     * @author Kaan Tural
     */
    private void mockUpdateSubscriptionService() {
        BDDMockito.given(updateSubscriptionService.updateSubscription(
                        ArgumentMatchers.anyString(),
                        ArgumentMatchers.anyString(),
                        ArgumentMatchers.anyString()))
                .willAnswer(invocation -> {
                    String requestPublisher = invocation.getArgument(0);
                    String requestSheet = invocation.getArgument(1);
                    String requestPayload = invocation.getArgument(2);

                    Map<Sheet, Response> validationResponse = ValidationUtils.validatePublisherAndSheet(
                            requestPublisher, requestSheet);
                    if (validationResponse.containsKey(null)) {
                        return validationResponse.get(null);
                    }
                    if (!ValidationUtils.validatePayload(requestPayload).isSuccess()) {
                        return ValidationUtils.validatePayload(requestPayload);
                    }
                    Sheet userSheet = validationResponse.keySet().iterator().next();
                    userSheet.addNewUpdatePublished(requestPayload);
                    return new Response(true, null);
                });
    }
}
