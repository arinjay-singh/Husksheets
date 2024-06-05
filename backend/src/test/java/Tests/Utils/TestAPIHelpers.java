package Tests.Utils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Value;
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


    public static void assertResponse(ResultActions resultActions, Response expectedOutput) throws Exception {
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(expectedOutput.isSuccess()))
                .andExpect(jsonPath("$.message").value(expectedOutput.getMessage()))
                .andExpect(jsonPath("$.time").exists());

        // Assert each element in the values list
        if (expectedOutput.getValues() != null) {
            for (int i = 0; i < expectedOutput.getValues().size(); i++) {
                Value expectedValue = expectedOutput.getValues().get(i);
                resultActions.andExpect(jsonPath("$.values[" + i + "].publisher").value(expectedValue.getPublisher()))
                        .andExpect(jsonPath("$.values[" + i + "].sheet").value(expectedValue.getSheet()))
                        .andExpect(jsonPath("$.values[" + i + "].id").value(expectedValue.getId()))
                        .andExpect(jsonPath("$.values[" + i + "].payload").value(expectedValue.getPayload()));
            }
        } else {
            resultActions.andExpect(jsonPath("$.values").isEmpty());
        }
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
