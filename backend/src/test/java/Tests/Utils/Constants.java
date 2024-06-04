package Tests.Utils;

import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Value;

/**
 * Static Vars class: Store static variables to avoid refactoring issues
 * author: Nicholas O'Sullivan
 */
public final class Constants {
    public static final String team5username = "Team5";
    public static final String team5password = "5password";
    public static final String mikeUsername = "Mike";
    public static final String mikePassword = "12345password";
    public static final  String registerRequest = "/api/v1/register";
    public static final String getPublishersRequest = "/api/v1/getPublishers";
    public static final String unauthorizedResponse = "Unauthorized";
    public static final Response registerResponseSuccess = new Response(true, null);
    public static final Value Team5PublisherNoDocsValue = new Value("Team5", null, null, null);
    public static final Value MikePublisherNoDocsValue = new Value("Mike", null, null, null);
}
