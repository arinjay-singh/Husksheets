/*
Core: Register interface
Author: Nicholas O'Sullivan
 */

package Services.Register;


import Services.DataTypes.User;

public interface RegisterService {
    //no arg passed, only body:{
    //    "publisher": "alice"
    //}
    //return json:{"success":true,"message":null,"value":[],"time":1716902506016}
    public void register(String request);
        //parseRequest
        //registerInStorage
        //returnMessage


    public User parseRegisterRequest(String request);
        //extract username
        //extract password


    public boolean registerInStorage(User user);
        //check no duplicate user, display error if username already registered
        //enter user credentials into DB
        //store username in plaintext
        //generate user_ID
        //hash/salt password

    public boolean returnRegisterRequest();

}
