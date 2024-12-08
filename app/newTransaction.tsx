import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { type Transaction, useDB } from '@/hooks/useDB';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewTransaction = () => {
  const [transaction, setTransaction] = useState<Transaction>({
    type: 'expense',
    amount: null,
    description: null,
    date: new Date(),
  });

  const { insertTransaction } = useDB();
  const [openDatePicker, setOpenDatePicker] = useState(false)

  const handleAmountChange = (text: string) => {
    const numericValue: unknown= text.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    setTransaction({ ...transaction, amount: numericValue as number});
  };

  const handleTypeChange = (type: Transaction['type']) => {
    setTransaction({ ...transaction, type });
  }

  const handleCategoryChange = (category: Transaction['category']) => {
    setTransaction({ ...transaction, category });
  }

  const handleDescriptionChange = (description:Transaction['description']) => {
    setTransaction({ ...transaction, description });
  }

  const addTransaction = async () => {
    // Add transaction logic
    const result = await insertTransaction(transaction);
    console.log('Transaction added', result);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.btnContainer}>
        <Pressable 
          style={
            [styles.btn, 
            {backgroundColor:transaction.type==='income'?'cyan':''}]
          } 
          onPress={() => handleTypeChange('income')}
          >
            <Text>Income</Text>
        </Pressable>
        <Pressable 
          style={
            [styles.btn, 
            {backgroundColor:transaction.type==='expense'?'cyan':''}]
          } 
          onPress={() => handleTypeChange('expense')}
          >
            <Text>Expense</Text>
        </Pressable>
      </View>
      <Text>Category</Text>
      <View style={styles.btnContainer}>
        <Pressable 
          style={
            [styles.btn, 
            {backgroundColor:transaction.category==='Food'?'cyan':''}]
          } 
          onPress={() => handleCategoryChange('Food')}
          >
            <Text>Food</Text>
        </Pressable>
        <Pressable 
          style={
            [styles.btn, 
            {backgroundColor:transaction.category==='Transport'?'cyan':''}]
          } 
          onPress={() => handleCategoryChange('Transport')}
          >
            <Text>Transport</Text>
        </Pressable>
        <Pressable 
          style={
            [styles.btn, 
            {backgroundColor:transaction.category==='Entertainment'?'cyan':''}]
          } 
          onPress={() => handleCategoryChange('Entertainment')}
          >
            <Text>Entertainment</Text>
        </Pressable>
        <Pressable 
          style={
            [styles.btn, 
            {backgroundColor:transaction.category==='Others'?'cyan':''}]
          } 
          onPress={() => handleCategoryChange('Others')}
          >   
            <Text>Others</Text>
        </Pressable>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder='expense'
          onChangeText={handleAmountChange}
          value={transaction.amount?.toString()}
          keyboardType="numeric"
          autoFocus
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.text}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder='Description'
          value={transaction.description ?? ''}
          onChangeText={handleDescriptionChange}
  
        />
      </View>
      <View style={styles.inputContainer}>
        <Text  style={styles.text}>Date</Text>
        <TextInput style={styles.input} value={transaction.date?.toDateString()} onPress={() => setOpenDatePicker(true)} />
        <DatePicker
          modal
          open={openDatePicker}
          date={transaction.date}
          onConfirm={(date) => {
            setOpenDatePicker(false)
            setTransaction({ ...transaction, date })
          }}
          onCancel={() => {
            setTransaction({ ...transaction })
          }}
        />
      </View>
      <View style={styles.btnContainer}>
        <Pressable style={styles.btn} onPress={router.back}>
          <Text>Cancel</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={addTransaction} disabled={!transaction.amount}>
          <Text>Add</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  inputContainer:{
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 40,
    width: '100%',
    marginBottom: 10,
  },
  text:{
    flex: 1,
    paddingVertical: 13,
    alignContent: 'space-between',  
    justifyContent: 'flex-start',
  },
  input:{
    flex: 3,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  datePicker: {
    width: '100%',
  },
  btn: {
    flex: 1,
    margin: 7,
    borderWidth: 1,
    borderBlockColor: 'blue',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

});

export default NewTransaction;