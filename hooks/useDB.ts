import * as SQLite from 'expo-sqlite'; 
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';


export interface Transaction {
    id?: number;
    date: Date;
    type: "income" | "expense";
    amount: number | null;
    description: string | null;
    category?: "Food" | "Transport" | "Entertainment" | "Others";
}

export const useDB = () => {
    const db = SQLite.openDatabaseSync('transaction.db');
    useDrizzleStudio(db);

    useEffect(() => {
        initDB();
        
        //debugDB()
    },[])

    const initDB = () => {
      const sql = `CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT,
                    type TEXT,
                    amount REAL,
                    description TEXT,
                    category TEXT
                )`
    
      db.execAsync(sql).then(()=> console.log('table created')).catch((e)=> console.log(e))
    }

    const insertTransaction = (transaction: Transaction) => {
        const sql = 'INSERT INTO transactions (type, date, amount, description, category) VALUES (?, ?, ?, ?, ?)'
        const args = [transaction.type, transaction.date.toISOString(), transaction.amount ?? 0, transaction.description ?? '', transaction.category ?? '']
        db.runAsync(sql, args)
    }

    const getAllTransactions = () => {
      const sql = 'SELECT * FROM transactions ORDER BY date DESC'
      return db.getAllAsync(sql).then((result) => result as Transaction[])
      
    };

    const getTransaction = (id: number) => {
        const sql = 'SELECT * FROM transactions WHERE id = ?'
        return db.getAllAsync(sql, [id]).then((result) => result[0] as Transaction)
    }

    const updateTransaction = (transaction: Transaction) => {
        const sql = 'UPDATE transactions SET type = ?, date = ?, amount = ?, description = ?, category = ? WHERE id = ?'
        const args = [transaction.type, transaction.date.toISOString(), transaction.amount ?? null, transaction.description ?? null, transaction.category ?? '', transaction.id ?? 0]
        db.runAsync(sql, args)
    }


    return {
      insertTransaction,
      getAllTransactions,
      updateTransaction,
      getTransaction
    }
}