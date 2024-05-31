/*
Register user service class
Author: Nicholas O'Sullivan
 */
package com.Services.Register;
import com.Services.DataTypes.User;
import com.Services.DataTypes.UserStorage;


public class RegisterUserService implements RegisterService {
/*
example of correct json
    {
    "username": "alice"
    "password": "asdawdawdad"
     }

 */
    /*
    Register user into database from request if valid.
    param = JSON type we define with spring boot, containing username, password
     */
    @Override
    public void register(String request) {
        User user = parseRegisterRequest(request);
        if (!registerInStorage(user)) {
            return; //ERROR in registering user,
        }
    }

    /*
    extract user info from register request.
     */
    @Override
    public User parseRegisterRequest(String request) {
        String username = "";
        String password = "";
        User user = new User(username, password);
        return user;
    }

    /*
    register user in UserStorage
     */
    @Override
    public boolean registerInStorage(User user) {
        UserStorage userStorage = UserStorage.getInstance();
        //addNewUser ret True if success, else false.
        return userStorage.addNewUser(user);
    }



    @Override
    public boolean returnRegisterRequest() {
        return false;
    }
}
