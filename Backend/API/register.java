interface Register {
    //no arg passed, only body:{
    //    "publisher": "alice"
    //}
    //return json:{"success":true,"message":null,"value":[],"time":1716902506016}
    public void register();
        //parseRequest
        //registerInDB
        //returnMessage


    public boolean parseRegisterRequest();
        //extract username
        //extract password


    public boolean registerInDB();
        //check no duplicate user, display error if username already registered
        //enter user credentials into DB
        //store username in plaintext
        //generate user_ID
        //hash/salt password

    public boolean returnRegisterRequest();

}
