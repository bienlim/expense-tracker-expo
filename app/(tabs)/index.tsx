import { type Records, useDB } from '@/hooks/useDB';
import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text, FlatList, Button, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, Pressable, TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
  


export default function HomeScreen() {
  const { getAllRecords } = useDB()
  const [transactions, setTransactions] = useState<Records[]>()
  const [totalExpense, setTotalExpense] = useState<number>()
  const [totalIncome, setTotalIncome] = useState<number>()
  const [balance, setBalance] = useState<number>()
  
  useFocusEffect(
    useCallback(() => {
      const loadAndCalculate = async () => {
        const loadedTransactions = await loadTransactions();
        const loadedExpenses = await calculateTotalExpense(loadedTransactions);
        const loadedIncome = await calculateTotalIncome(loadedTransactions);
        calculateBalance(loadedExpenses, loadedIncome);
      };
      loadAndCalculate();
    }, [])
  );

  const loadTransactions = async () => {
    const result = await getAllRecords()
    console.log('Transactions',result)
    setTransactions(result);
    return result;
  }

  const calculateTotalExpense = async (loadedTransactions: Records[]) => {
    const amount = (loadedTransactions ?? [])
      .filter((transaction) => transaction.type === 'expense')
      .reduce((acc, transaction) => acc + (transaction.amount || 0), 0)
      .toFixed(2);
    console.log('Total Expense', amount)
    setTotalExpense(Number.parseFloat(amount))
    return Number.parseFloat(amount)
  }

  const calculateTotalIncome = async (loadedTransactions: Records[]) => {
    const amount = (loadedTransactions ?? [])
      .filter((transaction) => transaction.type === 'income')
      .reduce((acc, transaction) => acc + (transaction.amount || 0), 0)
      .toFixed(2)
    console.log('Total Income', amount)
    setTotalIncome(Number.parseFloat(amount))
    return Number.parseFloat(amount)
  }

  const calculateBalance = async (loadedExpenses: number, loadedIncome: number) => {
    const balance = Number.parseFloat(Number((loadedIncome ?? 0) - (loadedExpenses ?? 0)).toFixed(2));
    console.log('Balance', balance)
    setBalance(balance)
  }

  const transactionItem = ({ item }: { item: Records }) => (
    <Pressable style={styles.transaction} onPress={() => router.push(`/transaction/${item.id}`)}>
      <View style={styles.transactionDetails}>
        <Text style={styles.description}>{item.note}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>
          {new Date(item.dateTime).toLocaleDateString('en-US',{
            year: 'numeric', // "2023"
            month: 'long', // "October"
            day: 'numeric', // "30"
          })}
        </Text>
      </View>
      <Text style={[styles.amount, { color: item.type === "expense" ? "red" : "green" }]}>
        {item.type === "expense" ? "-" : ""}{item.amount?.toLocaleString()}
      </Text>
  </Pressable>
  );



  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View style={styles.cardContainer}>
          <Text style={styles.text}>
            Home Screen
          </Text>
          <Text style={styles.text}>
            Balance: {balance?.toLocaleString()}
          </Text>
          <Text style={styles.text}>
            Total Expense: {totalExpense?.toLocaleString()}
          </Text>
          <Text style={styles.text}>
            Total Income: {totalIncome?.toLocaleString()}
          </Text>
        </View>
      <View style={styles.ListContainer}>
          <FlatList
            data={transactions}
            renderItem={transactionItem}
          />
        
          <Pressable
            style={styles.addBtn}
            onPress={()=> router.push('/newTransaction')}
          >
            <Ionicons name="add-circle" size={60} color="blue" />
          </Pressable>
      </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    flex: 1,
    padding: 0,
    backgroundColor: 'white',
  },
  cardContainer: {
    borderBottomWidth: 1,
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  ListContainer: {
    borderWidth: 0,
    flex: 2,
    backgroundColor: '#f8f9fa',
    margin: 4,
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,

  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  transactionDetails: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  addBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

})