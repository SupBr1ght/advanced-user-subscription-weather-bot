import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const USERS_FILE = path.join(__dirname, 'users.json');

@Injectable()
export class UsersService {
  private users: number[] = [];

  constructor() {
    // run once after DI initialization
    this.loadUsers();
  }

  loadUsers() {
    try {
      // read mock db with users
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      // conver json data into js object 
      this.users = JSON.parse(data);
    } catch {
      this.users = [];
    }
  }

  // save users into mock db
  saveUsers() {
    fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2));
  }

  // add user to file
  addUser(id: number): boolean {
    if (!this.users.includes(id)) {
      this.users.push(id);
      this.saveUsers();
      return true;
    }
    return false;
  }

  // remove user from mock db
  removeUser(id: number): boolean {
    if (this.users.includes(id)) {
      this.users = this.users.filter(uid => uid !== id);
      this.saveUsers();
      return true;
    }
    return false;
  }

  getUsers(): number[] {
    return this.users;
  }
}
