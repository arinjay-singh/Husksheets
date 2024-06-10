package Tests.utils;

import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Value;

/**
 * Static Vars class: Store static variables to avoid refactoring issues
 * @author Nicholas O'Sullivan and Kaan Tural
 */
public final class Constants {
    public static final String team5username = "Team5";
    public static final String team5password = "5password";
    public static final String mikeUsername = "Mike";
    public static final String mikePassword = "12345password";

    public static final String registerRequest = "/api/v1/register";
    public static final String getPublishersRequest = "/api/v1/getPublishers";
    public static final String createSheetRequest = "/api/v1/createSheet";
    public static final String getSheetsRequest = "/api/v1/getSheets";
    public static final String deleteSheetRequest = "/api/v1/deleteSheet";
    public static final String updatePublishedRequest = "/api/v1/updatePublished";
    public static final String updateSubscriptionRequest = "/api/v1/updateSubscription";
    public static final String getUpdatesForPublishedRequest = "/api/v1/getUpdatesForPublished";
    public static final String getUpdatesForSubscriptionRequest = "/api/v1/getUpdatesForSubscription";

    public static final String unauthorizedResponse = "Unauthorized";
    public static final Response registerResponseSuccess = new Response(true, null);
    public static final Value Team5PublisherNoDocsValue = new Value("Team5", null, null, null);
    public static final Value MikePublisherNoDocsValue = new Value("Mike", null, null, null);

    public static final Response createSheetResponseSuccess = new Response(true, null);
    public static final Response createSheetForOtherPublisherResponseError =
            new Response(false, "Unauthorized: sender is not owner of sheet");

    public static final Response getSheetsResponseSuccess = new Response(true, null);
    public static final Response getSheetsResponseError = new Response(false, "Sheet not found: Team5/Sheet1");
    public static final Response getSheetsResponseError2 = new Response(false, "Sheet not found: Team5/MikeTypeSheet");
    public static final Response deleteSheetResponseSuccess = new Response(true, null);
    public static final Response deleteSheetResponseError = new Response(false, "Sheet not found: Team5/Sheet1");

    public static final Response updatePublishedResponseSuccess = new Response(true, null);
    public static final Response updateSubscriptionResponseSuccess = new Response(true, null);
    public static final Response getUpdatesForPublishedResponseSuccess = new Response(true, null);
    public static final Response getUpdatesForSubscriptionResponseSuccess = new Response(true, null);

    /*public static final Response updatePublishedPayloadNullError = new Response(false, "Payload is null");
    public static final Response updateSubscriptionPayloadNullError = new Response(false, "Payload is null");*/
    public static final Response getUpdatesForPublishedIdNullError = new Response(false, "ID is null");
    /*public static final Response getUpdatesForSubscriptionIdNullError = new Response(false, "ID is null");*/
    public static final Response publisherNotOwnerError = new Response(false, "Unauthorized: sender is not owner of sheet");
    public static final Response updateSheetNotFound = new Response(false, "Sheet not found: Team5/");
}

