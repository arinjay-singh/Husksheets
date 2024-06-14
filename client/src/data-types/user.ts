/**
 * @file user.ts
 * @brief User class to store user information and roles for different sheets
 * @version 1.0
 * @date 06-01-2024
 * @author Arinjay Singh
 */

enum Role {
    Publisher,
    Subscriber,
}

class User {
    id: string;
    name: string;
    sheets: { [sheetId: string]: Role };

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.sheets = {};
    }

    addSheetRole(sheetId: string, role: Role) {
        this.sheets[sheetId] = role;
    }

    removeSheetRole(sheetId: string) {
        delete this.sheets[sheetId];
    }

    getRoleForSheet(sheetId: string): Role | undefined {
        return this.sheets[sheetId];
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getSheets(): { [sheetId: string]: any} {
        return Object.keys(this.sheets);
    }

    
}

export { User, Role };