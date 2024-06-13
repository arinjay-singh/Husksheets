package Tests.utils;
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
 *
 */
public class TestAPIHelpers {


    /**
     * do a GET request w/ basic auth
     * @author Nicholas O'Sullivan
      */
    public static ResultActions performGetRequestWithBasicAuth(MockMvc mockMvc,
                                                               String url,
                                                               String username,
                                                               String password) throws Exception {
        String auth = username + ":" + password;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
        return mockMvc.perform(MockMvcRequestBuilders.get(url)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth));
    }

    /**
     *     do a POST request w/ Basic Auth
     *     @author Nicholas O'Sullivan
      */
    public static ResultActions performPostRequestWithBasicAuthBody(MockMvc mockMvc,
                                                                String url,
                                                                String username,
                                                                String password,
                                                                String requestBodyJson) throws Exception {
        String auth = username + ":" + password;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
        return mockMvc.perform(MockMvcRequestBuilders.post(url)
            .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth)
            .contentType("application/json")
            .content(requestBodyJson));
    }

    /**
     * do a GET request w/o Basic Auth
     * @author Nicholas O'Sullivan
      */
    public static ResultActions performGetRequestNoAuth(MockMvc mockMvc, String url) throws Exception {
        return mockMvc.perform(MockMvcRequestBuilders.get(url));
    }

    /**
     * Assert expected response vs actual.
     */
    public static void assertResponse(ResultActions resultActions, Response expectedOutput) throws Exception {
        /**
         * @author Nicholas O'Sullivan
         */
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(expectedOutput.isSuccess()))
                .andExpect(jsonPath("$.message").value(expectedOutput.getMessage()))
                .andExpect(jsonPath("$.time").exists());
        /**
         * @author Kaan Tural
         */
        if (expectedOutput.getValue() != null) {
            for (int i = 0; i < expectedOutput.getValue().size(); i++) {
                Value expectedValue = expectedOutput.getValue().get(i);
                resultActions.andExpect(jsonPath("$.value[" + i + "].publisher").value(expectedValue.getPublisher()))
                        .andExpect(jsonPath("$.value[" + i + "].sheet").value(expectedValue.getSheet()))
                        .andExpect(jsonPath("$.value[" + i + "].id").value(expectedValue.getId()))
                        .andExpect(jsonPath("$.value[" + i + "].payload").value(expectedValue.getPayload()));
            }
        } else {
            resultActions.andExpect(jsonPath("$.value").isEmpty());
        }
    }

    /**
     * Convert an obj to JSON
     * @author Kaan Tural.
     */
    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
