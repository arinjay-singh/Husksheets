package Tests;


import Tests.utils.Constants;
import Tests.utils.TestAPIHelpers;
import com.husksheets_api_server_scrumlords.models.Publisher;
import com.husksheets_api_server_scrumlords.models.Publishers;
import com.husksheets_api_server_scrumlords.models.Response;
import com.husksheets_api_server_scrumlords.models.Value;
import com.husksheets_api_server_scrumlords.serialize.SerializationUtil;
import com.husksheets_api_server_scrumlords.services.GetPublishersService;
import com.husksheets_api_server_scrumlords.services.RegisterUserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * Test register & get publishers service
 * @author Nicholas O'Sullivan
 */
public class TestRegisterGetPublishersService {
        private RegisterUserService registerUserService;
        private GetPublishersService getPublishersService;
        @BeforeEach
        public void setUp() {
                SerializationUtil.clearSerializedData("publishers.ser");
                registerUserService = new RegisterUserService();
                getPublishersService = new GetPublishersService();
                Publishers.getInstance().getPublisherMap().clear();

        }

        @Test
        public void testRegisterGetPublishersService() {
                ArrayList<Value> expectedPublishers = new ArrayList<>();
                Response getPublishersResponseSuccess = new Response(true, null);
                Response actualResponse;

                //no publishers registered.
                Assertions.assertEquals(getPublishersResponseSuccess, getPublishersService.getPublishers());


                //register regular username
                actualResponse = registerUserService.register(Constants.team5username);
                Assertions.assertEquals(Constants.registerResponseSuccess, actualResponse);

                //get Publishers: should return Team5
                expectedPublishers.addFirst(Constants.Team5PublisherNoDocsValue);
                getPublishersResponseSuccess.setValues(expectedPublishers);
                actualResponse = getPublishersService.getPublishers();
                Assertions.assertEquals(getPublishersResponseSuccess, actualResponse);

                //register null username, should return success, but no null user registered.
                actualResponse = registerUserService.register(null);
                Assertions.assertEquals(Constants.registerResponseSuccess, actualResponse);

                //get Publishers: should return Team5
                actualResponse = getPublishersService.getPublishers();
                Assertions.assertEquals(getPublishersResponseSuccess, actualResponse);


                //register empty username, should return success, but no null user registered.
                actualResponse = registerUserService.register(null);
                Assertions.assertEquals(Constants.registerResponseSuccess, actualResponse);

                //get Publishers: should return Team5
                actualResponse = getPublishersService.getPublishers();
                Assertions.assertEquals(getPublishersResponseSuccess, actualResponse);

                //register regular username2
                actualResponse = registerUserService.register(Constants.mikeUsername);
                Assertions.assertEquals(Constants.registerResponseSuccess, actualResponse);

                //get Publishers: should return Team5 & Mike
                expectedPublishers.addFirst(Constants.MikePublisherNoDocsValue);
                getPublishersResponseSuccess.setValues(expectedPublishers);
                actualResponse = getPublishersService.getPublishers();
                Assertions.assertEquals(getPublishersResponseSuccess, actualResponse);
        }
}
