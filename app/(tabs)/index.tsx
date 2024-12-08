import { type Transaction, useDB } from '@/hooks/useDB';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text, FlatList, Button, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, Pressable, TextInput } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
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

    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index);
    }, []);

  const addTransaction = async () => {
    //const result = await insertTransaction(transaction)
    //console.log('Transaction added',result)
  }

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
      <BottomSheetModalProvider>
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
            onPress={handlePresentModalPress}
          >
            <Ionicons name="add-circle" size={60} color="blue" />
          </Pressable>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
          >
                <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <BottomSheetView style={styles.contentContainer}>
                <Text>New Expense 🎉</Text>
                <InputForm title="Type"/>
                <InputForm title="Amount"/>
                <InputForm title="Description"/>
                <InputForm title="Date & Time"/>
  
              <View style={{flexDirection:'row'}}>
                <Button title="Add" onPress={addTransaction}/>
              </View>
            </BottomSheetView>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </BottomSheetModal>
        </View>
      
        </BottomSheetModalProvider>
        
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