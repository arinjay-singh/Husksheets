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

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * TestRegister API
 * author: Nicholas O'Sullivan
 */

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = RegisterController.class)
@ContextConfiguration(classes = {RegisterController.class, RegisterUserService.class, SpringSecurityConfig.class})
public class TestAPIs {

    //instead of this moving forward we shoud set a for loop to test two random users from our future userLogins enum


    @Autowired
    public MockMvc mockMvc;
    @MockBean
    private RegisterUserService registerUserService;
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //main test template
     @Test
    public void testAPIs() throws Exception {
        //test get publishers when no publishers registered.
         testNoAuth(StaticVars.getPublishersRequest);
         testGetPublishersAPI(StaticVars.getPublishersEmptySuccess, StaticVars.getPublishersRequest, StaticVars.username1, StaticVars.password1);

         // register publisher 1
       // testNoAuth(StaticVars.registerRequest);
        testRegisterAPI(StaticVars.registerRequest, StaticVars.username1, StaticVars.password1);

        //get publishers w/ 1 publisher registered.
         //testGetPublishersAPI(StaticVar, StaticVars.getPublishersRequest, StaticVars.username1, StaticVars.password1);


         //register publisher 2

    }


    //======================================== Register Helpers ================================================
    public void testRegisterAPI(String request, String username, String password) throws Exception {
        mockRegisterService(StaticVars.registerResponseSuccess);
        ResultActions resultActions = TestAPIHelpers.performGetRequestWithBasicAuth(mockMvc,
                request,
                username,
                password);
        TestAPIHelpers.assertResponse(resultActions, StaticVars.registerResponseSuccess);
    }
    private void mockRegisterService(Response expectedOutput) {
        BDDMockito.given(registerUserService.register(ArgumentMatchers.anyString())).willReturn(expectedOutput);
    }

    //======================================== getPublishers Helpers
    public void testGetPublishersAPI(Response expectedResponse, String request, String username, String password) throws Exception {
        ResultActions resultActions = TestAPIHelpers.performGetRequestWithBasicAuth(mockMvc,
                request,
                username,
                password);
        TestAPIHelpers.assertResponse(resultActions, expectedResponse);
    }

    //======================================== No Auth Helpers
    public void testNoAuth(String url) throws Exception {

        String noAuthExpectedOutput = StaticVars.unauthorizedResponse;
        //trigger request
        ResultActions resultActions = TestAPIHelpers.performGetRequestNoAuth(mockMvc, url);
        resultActions.andExpect(status().isUnauthorized())
                     .andExpect(content().string(noAuthExpectedOutput));
    }




}