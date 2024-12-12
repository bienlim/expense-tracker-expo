import * as SQLite from 'expo-sqlite'; 
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useEffect } from 'react';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';


export interface Records {
    id?: number;
    dateTime: Date;
    type: "income" | "expense" | "transfer";
    amount: number | null;
    account: string | null;
    category?: string;
    note: string | null;
};

export interface Category {
  id?: number;
  category: string;
};

export interface Account {
  id?: number;
  account: string;
  type: "Cash" | "Saving" | "Credit Card";
  balance: number;
};



export const useDB = () => {
    const db = SQLite.openDatabaseSync('records.db');
    useDrizzleStudio(db);

    useEffect(() => {
        initDB();
    },[])

    const initDB = () => {
      const createRecordsTable = `CREATE TABLE IF NOT EXISTS records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    dateTime TEXT,
                    type TEXT,
                    amount REAL,
                    account TEXT,
                    category TEXT,
                    note TEXT
                );`
      const createCategoryTable = `CREATE TABLE IF NOT EXISTS category (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    category TEXT
                );`  
      const createAccountTable = `CREATE TABLE IF NOT EXISTS account (  
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    account TEXT,
                    type TEXT,
                    balance REAL
                );`  
    
      db.execAsync(
          createRecordsTable +
          createCategoryTable +
          createAccountTable
        ).then(()=> console.log('table created')).catch((e)=> console.log(e))
    }

    const insertRecord = (records: Records) => {
        const sql = 'INSERT INTO records (dateTime, type,  amount, account, category, note) VALUES (?, ?, ?, ?, ?, ?)'
        const args = [
            records.dateTime.toISOString(), 
            records.type, 
            records.amount ?? 0, 
            records.account ?? '',
            records.category ?? '',
            records.note ?? '']
        db.runAsync(sql, args).catch((e)=> console.log(e))
    }

    const getAllRecords = () => {
      const sql = 'SELECT * FROM records ORDER BY dateTime DESC'
      return db.getAllAsync(sql).then((result) => result as Records[])
      
    };

    const getRecord = (id: number) => {
        const sql = 'SELECT * FROM records WHERE id = ?'
        return db.getAllAsync(sql, [id]).then((result) => result[0] as Records)
    }

    const updateRecord = (record: Records) => {
        const sql = 'UPDATE records SET dateTime = ?, type = ?,  amount = ?, account =?,  category = ?, note = ? WHERE id = ?'
        const args = [
            record.dateTime.toISOString(), 
            record.type, 
            record.amount ?? null,
            record.account ?? '', 
            record.category ?? '', 
            record.note ?? null, 
            record.id ?? 0]
        db.runAsync(sql, args)
    }

    const insertCategory = (category: Category) => {
      const sql = 'INSERT INTO category (category) VALUES (?)'
      db.runAsync(sql, [category.category])
    }

    const getAllCategory = () => {
      const sql = 'SELECT * FROM category'
      return db.getAllAsync(sql).then((result) => result as Category[])
    }

    const insertAccount = (account: Account) => {
      const sql = 'INSERT INTO account (account, type, balance) VALUES (?, ?, ?)'
      db.runAsync(sql, [account.account, account.type, account.balance])
    }

    const getAllAccount = () => {
      const sql = 'SELECT * FROM account'
      return db.getAllAsync(sql).then((result) => result as Account[])
    }


    return {
      insertRecord,
      getAllRecords,
      updateRecord,
      getRecord
    }
}