import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database: any = SQLiteObject;

  constructor(private sqlite: SQLite) {}

  async createDatabase() {
    try {
      this.database = await this.sqlite.create({
        name: 'mydatabase.db',
        location: 'default'
      });
      await this.createTable();
    } catch (error) {
      console.error('Error opening database', error);
    }
  }

  private createTable() {
    const query = 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)';
    return this.database.executeSql(query, []);
  }

  async getItems() {
    const query = 'SELECT * FROM items';
    const result = await this.database.executeSql(query, []);
    const items = [];
    for (let i = 0; i < result.rows.length; i++) {
      items.push(result.rows.item(i));
    }
    return items;
  }

  async addItem(name: string) {
    const query = 'INSERT INTO items (name) VALUES (?)';
    return this.database.executeSql(query, [name]);
  }

  async updateItem(id: number, name: string) {
    const query = 'UPDATE items SET name = ? WHERE id = ?';
    return this.database.executeSql(query, [name, id]);
  }

  async deleteItem(id: number) {
    const query = 'DELETE FROM items WHERE id = ?';
    return this.database.executeSql(query, [id]);
  }
}