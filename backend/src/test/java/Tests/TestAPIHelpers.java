package Tests;
import com.husksheets_api_server_scrumlords.models.Response;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import java.util.Base64;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * TestAPIHelpers class: Consolidate reusable test methods
 * author: Nicholas O'Sullivan
 */
public class TestAPIHelpers {

    // do a GET request w/ Basic Auth
    public static ResultActions performGetRequestWithBasicAuth(MockMvc mockMvc,
                                                               String url,
                                                               String username,
                                                               String password) throws Exception {
        String auth = username + ":" + password;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
        return mockMvc.perform(MockMvcRequestBuilders.get(url)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth));
    }

    // do a POST request w/ Basic Auth
    public static ResultActions performPostRequestWithBasicAuth(MockMvc mockMvc,
                                                                String url,
                                                                String username,
                                                                String password) throws Exception {
        String auth = username + ":" + password;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
        return mockMvc.perform(MockMvcRequestBuilders.post(url)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth));
    }

    // do a GET request w/o Basic Auth
    public static ResultActions performGetRequestNoAuth(MockMvc mockMvc, String url) throws Exception {
        return mockMvc.perform(MockMvcRequestBuilders.get(url));
    }


    //compare actual vs/ expected
    public static void assertResponse(ResultActions resultActions, Response expectedOutput) throws Exception {
       // System.out.println(resultActions.toString());
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(expectedOutput.isSuccess()))
                .andExpect(jsonPath("$.message").value(expectedOutput.getMessage()))
                .andExpect(jsonPath("$.values").isArray()) //change to something diff
                .andExpect(jsonPath("$.time").exists());
    }









}
