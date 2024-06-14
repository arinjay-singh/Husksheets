package Tests;

import Tests.utils.Constants;
import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Value;
import com.husksheets_api_server_scrumlords.serialize.SerializationUtil;
import com.husksheets_api_server_scrumlords.services.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * Test create, get, and delete sheets services
 * @author Nicholas O'Sullivan
 */
public class TestSheetServices {
    private RegisterUserService registerUserService;
    private GetPublishersService getPublishersService;
    private CreateSheetService createSheetService;
    private DeleteSheetService deleteSheetService;
    private GetSheetsService getSheetsService;
    @BeforeEach
    public void setUp() {
        SerializationUtil.clearSerializedData("publishers.ser");
        registerUserService = new RegisterUserService();
        getPublishersService = new GetPublishersService();
        createSheetService = new CreateSheetService();
        deleteSheetService = new DeleteSheetService();
        getSheetsService = new GetSheetsService();
        Publishers.getInstance().getPublisherMap().clear();
    }

    @Test
    public void testSheetsService() {
        ArrayList<Value> expectedSheetsTeam5 = new ArrayList<>();
        ArrayList<Value> expectedSheetsMike = new ArrayList<>();
        Response getSheetResponseSuccess = new Response(true, null);
        registerUserService.register(Constants.team5username);
        registerUserService.register(Constants.mikeUsername);
        Publisher team5Publisher = Publishers.getInstance().getPublisher(Constants.team5username);
        Publisher mikePublisher = Publishers.getInstance().getPublisher(Constants.mikeUsername);
        Response actualResponse = null;

        //create new sheet team5: sheet1
        actualResponse = createSheetService.createSheet(team5Publisher, "Sheet1");
        Assertions.assertEquals(Constants.createSheetResponseSuccess, actualResponse);

        expectedSheetsTeam5.add(new Value(Constants.team5username, "Sheet1", null, null));
        getSheetResponseSuccess.setValue(expectedSheetsTeam5);
        //get sheets from team5 returns sheet1
        actualResponse = getSheetsService.getSheets(team5Publisher);
        Assertions.assertEquals(getSheetResponseSuccess, actualResponse);

        //team5 try to create sheet that already exists
        actualResponse = createSheetService.createSheet(team5Publisher, "Sheet1");
        Assertions.assertEquals(new Response(false, "Sheet already exists: Sheet1"), actualResponse);

        //get sheets return the same as prev
        actualResponse = getSheetsService.getSheets(team5Publisher);
        Assertions.assertEquals(getSheetResponseSuccess, actualResponse);

        //create new sheet team5: sheet2
        actualResponse = createSheetService.createSheet(team5Publisher, "Sheet2");
        Assertions.assertEquals(new Response(true, null), actualResponse);

        expectedSheetsTeam5.add(new Value(Constants.team5username, "Sheet2", null, null));
        getSheetResponseSuccess.setValue(expectedSheetsTeam5);
        //get sheets from team5 returns sheet1, sheet2
        actualResponse = getSheetsService.getSheets(team5Publisher);
        Assertions.assertEquals(getSheetResponseSuccess, actualResponse);

        //create new sheet mike: Sheet1
        actualResponse = createSheetService.createSheet(mikePublisher, "Sheet1");
        Assertions.assertEquals(new Response(true, null), actualResponse);

        expectedSheetsMike.add(new Value(Constants.mikeUsername, "Sheet1", null, null));
        getSheetResponseSuccess.setValue(expectedSheetsMike);
        //get sheets from mike returns Sheet1
        actualResponse = getSheetsService.getSheets(mikePublisher);
        Assertions.assertEquals(getSheetResponseSuccess, actualResponse);

        //delete sheet team5: sheet2
        actualResponse = deleteSheetService.deleteSheet(team5Publisher, "Sheet2");
        Assertions.assertEquals(new Response(true, null), actualResponse);

        expectedSheetsTeam5.remove(new Value(Constants.team5username, "Sheet2", null, null));
        getSheetResponseSuccess.setValue(expectedSheetsTeam5);
        //get sheets from team5 returns sheet1
        actualResponse = getSheetsService.getSheets(team5Publisher);
        Assertions.assertEquals(getSheetResponseSuccess, actualResponse);

        //delete sheet team5: sheet2 error, sheet2 doesnt exist anymore
        actualResponse = deleteSheetService.deleteSheet(team5Publisher, "Sheet2");
        Assertions.assertEquals(new Response(false, "Sheet does not exist: Sheet2"), actualResponse);
        //get sheets from team 5 returns sheet1
        actualResponse = getSheetsService.getSheets(team5Publisher);
        Assertions.assertEquals(getSheetResponseSuccess, actualResponse);

        //delete sheet team5: sheet1,
        actualResponse = deleteSheetService.deleteSheet(team5Publisher, "Sheet1");
        Assertions.assertEquals(new Response(true, null), actualResponse);

        expectedSheetsTeam5.remove(new Value(Constants.team5username, "Sheet1", null, null));
        getSheetResponseSuccess.setValue(expectedSheetsTeam5);
        //getSheets team5, no more sheets
        actualResponse = getSheetsService.getSheets(team5Publisher);
        Assertions.assertEquals(getSheetResponseSuccess, actualResponse);
    }
}
