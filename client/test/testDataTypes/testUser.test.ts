/**
 * @file testUser.test.ts
 * @brief Tests for the User class
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

import { User, Role } from '../../src/data-types/user';


describe('User class tests', () => {
    it('should create a new user with the given id and name', () => {
        const user = new User('1', 'Alice');
        expect(user.id).toBe('1');
        expect(user.name).toBe('Alice');
        expect(user.sheets).toEqual({});
    });

    it('should add a role to a sheet for a user', () => {
        const user = new User('1', 'Alice');
        user.addSheetRole('sheet1', Role.Admin);
        expect(user.sheets['sheet1']).toBe(Role.Admin);
    });

    it('should return the correct role for a sheet', () => {
        const user = new User('1', 'Alice');
        user.addSheetRole('sheet1', Role.Admin);
        user.addSheetRole('sheet2', Role.Collaborator);
        expect(user.getRoleForSheet('sheet1')).toBe(Role.Admin);
        expect(user.getRoleForSheet('sheet2')).toBe(Role.Collaborator);
    });

    it('should return undefined for a sheet with no role assigned', () => {
        const user = new User('1', 'Alice');
        expect(user.getRoleForSheet('sheet1')).toBeUndefined();
    });
});
