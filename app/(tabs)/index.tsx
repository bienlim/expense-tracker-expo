import { type Transaction, useDB } from '@/hooks/useDB';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text, FlatList, Button, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, Pressable, TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import InputForm from '@/components/InputForm';
  


export default function HomeScreen() {
  const { insertTransaction, getAllTransactions } = useDB()
  const [transactions, setTransactions] = useState<Transaction[]>()
  const [type, setType] = useState<string>()
  const [amount, setAmount] = useState<number>()
  const [description, setDescription] = useState<string>()  
  const [datetime, setDatetime] = useState<Date>()

  useFocusEffect(
    useCallback(() => {
      loadTransactions()
    },[]),
  )



  const loadTransactions = async () => {
    const result = await getAllTransactions()
    console.log('Transactions',result)
    setTransactions(result)
  }


  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View style={styles.CardContainer}>
          <Text style={{flex:1}}>
            Home Screen
          </Text>
        </View>
      <View style={styles.ListContainer}>
          <FlatList
            data={transactions}
            renderItem={({ item }) => 
              <View style={styles.transaction}>
                <View>
                  <Text>{item.description}</Text>
                  <Text>{item.type}</Text>
                </View>
                <Text>{item.amount}</Text>
              </View>

            }
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
    flex: 1,
    backgroundColor: '#fff',
  },
  CardContainer: {
    flex:1,
    backgroundColor: 'grey',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    marginBottom: 0,
  },
  ListContainer: {
    flex: 2,
    backgroundColor: 'grey',
    margin: 16,
    padding: 16,
    borderRadius: 8,

  },
  transaction: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    margin: 8,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  addBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  }

})