import InputForm from '@/components/InputForm'
import { type Transaction, useDB } from '@/hooks/useDB'
import { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Pressable, Button, TextInput } from 'react-native'

const newTransaction = () => {
  const [transaction, setTransaction] = useState<Transaction>({})
  const { insertTransaction } = useDB()

  const addTransaction = async () => {
    //const result = await insertTransaction(transaction)
    //console.log('Transaction added',result)
  }

  const handleChange = (text: string) => {
    // Allow only numbers
    const amount:number = text.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    setTransaction({...transaction, amount});
};

  return (
        <View style={styles.container}>

              <View style={styles.inputContainer}>
                    <Text style={styles.text}>Type</Text>
                    <TextInput
                      style={styles.input}
                      placeholder='expense'
                      value={transaction.type}
                      autoFocus
                    />
              </View>
              <View style={styles.inputContainer}>
                    <Text style={styles.text}>Amount</Text>
                    <TextInput
                      style={styles.input}
                      placeholder='expense'
                      onChangeText = {handleChange}
                      value={transaction.amount?.toString()}
                      keyboardType="numeric"
                      autoFocus
                    />
              </View>
              <View style={styles.inputContainer}>
                    <Text style={styles.text}>Description</Text>
                    <TextInput
                      style={styles.input}
                      placeholder='expense'
                      value={transaction.description}
                      autoFocus
                    />
              </View>
              <View style={styles.inputContainer}>
                    <Text style={styles.text}>Description</Text>
                    <TextInput
                      style={styles.input}
                      placeholder='expense'
                      value={transaction.description}
                      autoFocus
                    />
              </View>
  
              <View style={{flexDirection:'row'}}>
                <Button title="Add" onPress={addTransaction}/>
              </View>


        </View>
      
  
  )
}


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
}
})
export default newTransaction