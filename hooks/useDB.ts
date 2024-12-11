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
}

export const useDB = () => {
    const db = SQLite.openDatabaseSync('records.db');
    useDrizzleStudio(db);

    useEffect(() => {
        initDB();
    },[])

    const initDB = () => {
      const sql = `CREATE TABLE IF NOT EXISTS records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    dateTime TEXT,
                    type TEXT,
                    amount REAL,
                    account TEXT,
                    category TEXT,
                    note TEXT
                )`
    
      db.execAsync(sql).then(()=> console.log('table created')).catch((e)=> console.log(e))
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


    return {
      insertRecord,
      getAllRecords,
      updateRecord,
      getRecord
    }
}