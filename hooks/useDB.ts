import * as SQLite from 'expo-sqlite'; 
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';


export interface Transaction {
    id: number;
    datetime: Date;
    type: "income" | "expense";
    amount: number;
    description: string;
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
                    datetime TEXT,
                    type TEXT,
                    amount REAL,
                    description TEXT
                )`
    
      db.execAsync(sql).then(()=> console.log('table created')).catch((e)=> console.log(e))
    }

    const insertTransaction = (transaction: Transaction) => {
        const sql = 'INSERT INTO transactions (type, amount, description) VALUES (?, ?, ?, ?)'
        const args = [transaction.datetime.toISOString(), transaction.type, transaction.amount, transaction.description]
        db.runAsync(sql, args)
    }

    const getAllTransactions = () => {
      const sql = 'SELECT * FROM transactions'
      return db.getAllAsync(sql).then((result) => result as Transaction[])
      
    }

    const debugDB = async () => {
      if(Platform.OS === 'android') {

      } else {
        console.log(FileSystem.documentDirectory);
        await Sharing.shareAsync(FileSystem.documentDirectory + 'SQLite/transaction.db')
      }
    
    }


    return {
      insertTransaction,
      getAllTransactions
    }
}