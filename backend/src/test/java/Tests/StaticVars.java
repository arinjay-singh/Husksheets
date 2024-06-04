package Tests;

import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Value;

/**
 * Static Vars class: Store static variables to avoid refactoring issues
 * author: Nicholas O'Sullivan
 */
public class StaticVars
{
    public static final String username1 = "Team5";
    public static final String password1 = "5password";
    public static final String username2 = "Mike";
    public static final String password2 = "12345password";
    public static final  String registerRequest = "/api/v1/register"; //same with this request thing we should abstract it
    public static final String getPublishersRequest = "/api/v1/getPublishers";
    public static final String unauthorizedResponse = "Unauthorized";
    public static final Response registerResponseSuccess = new Response(true, null);
    public static final Response getPublishersEmptySuccess = new Response(true, null);
    public static final Value EmptyTeam5PublisherValue = new Value("Team5", null, null, null);
    public static final Response getPublishersTeam5Success = new Response(true, null);



}
