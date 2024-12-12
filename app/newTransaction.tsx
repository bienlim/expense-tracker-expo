import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, TouchableOpacity, Keyboard} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { type Records, useDB } from '@/hooks/useDB';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recordFormStyles } from '@/styles/recordFormStyles';
import { numPadStyles } from '@/styles/numPadStyles';
import { Ionicons } from '@expo/vector-icons';
import { evaluate } from 'mathjs';
import DropDownPicker from 'react-native-dropdown-picker';


const NewTransaction = () => {
const [record, setRecord] = useState<Records>({
    id: undefined,
    type: 'expense',
    amount: null,
    note: null,
    dateTime: new Date(),
    account: '',
  });
  const [input, setInput] = useState('');

  const { insertRecord } = useDB();
  const [openDatePicker, setOpenDatePicker] = useState(false)


  const [openAccount, setOpenAccount] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [allAccounts, setAllAccounts] = useState([
      {label: 'Kcash', value: 'Kcash'},
      {label: 'BDO', value: 'BDO'},
      {label: 'PNB', value: 'PNB'},
  ]);

  const [openCategory, setOpenCategory] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [allCategory, setAllCategory] = useState([
      {label: 'Food', value: 'Food'},
      {label: 'Transpo', value: 'Transpo'},
      {label: 'Entertainment', value: 'Entertainment'},
  ]);

  // Actions

  const handleTypeChange = (type: Records['type']) => {
    setRecord({ ...record, type });
  }

  const handleCategoryChange = (category: Records['category']) => {
    setRecord({ ...record, category });
  }

  const handleNoteChange = (note:Records['note']) => {
    setRecord({ ...record, note });
  }

  const addRecord = async () => {
    const result = await insertRecord({...record, account, category});
    console.log('Record added', {...record, account, category});
    router.back();
  };

  const handlePress = (value: string) => {
    let newInput:string;
    Keyboard.dismiss();
    console.log("Check periods",input.split(/[0-9]/).at(-2))
    
    // # Avoid sequential operators
    if(
      ['+','-','*','/'].includes(value) 
      && ['+','-','*','/','.'].includes(input.at(-1) ?? '')
    ){
      newInput = input.slice(0, -1) + value;
    // ## Avoid multiple periods
    } else if (value === '.' && input.replace(/[0-9]/g, '').at(-1) === '.') {
      newInput = input
    } else {  
      newInput = input + value
    }

    setInput(newInput);

    try {
      const evalResult = evaluate(newInput).toFixed(2); // Note: Using eval can be dangerous. Use a proper math parser in production.
      setRecord({ ...record, amount: evalResult});
    } catch (error) {
      setRecord({ ...record, amount: null});
    }
      
    console.log('transaction', record.amount)
  };

  const handleClear = () => {
    Keyboard.dismiss();
    const newInput = input.slice(0, -1);
    setInput(newInput);
    try {
      const evalResult = evaluate(newInput).toFixed(2); // Note: Using eval can be dangerous. Use a proper math parser in production.
      setRecord({ ...record, amount: evalResult});
    } catch (error) {
      setRecord({ ...record, amount: null});
    }
  };

  const handleCalculate = () => {
    try {
      const evalResult = evaluate(input).toFixed(2); // Note: Using eval can be dangerous. Use a proper math parser in production.
      setRecord({ ...record, amount: evalResult});
    } catch (error) {
      setRecord({ ...record, amount: null});
      alert('Invalid expression');
    }
  };

  
  // # Sub-components
  const TypeButton = ({type}:{type:Records['type']}) => (
      <Pressable 
        style={
           
          record.type === type ? recordFormStyles.typeActiveBtn : recordFormStyles.typeBtn
        } 
        onPress={() => handleTypeChange(type)}
        >
          <Text>{type}</Text>
      </Pressable>
  )


  const CategoryButton = ({category}:{category:Records['category']}) => (
    <Pressable 
        style={
          [recordFormStyles.typeBtn, 
          {backgroundColor:'#ffffff'}]
        } 
        onPress={() => handleCategoryChange(category)}
        >
          <Text>{category}</Text>
      </Pressable>
  )

  const NumPadKey = ({ keyLabel }: { keyLabel: string }) => (
    <TouchableOpacity style={numPadStyles.button} onPress={() => handlePress(keyLabel)}>
      <Text style={numPadStyles.buttonText}>{keyLabel}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={recordFormStyles.container}>

      {/* Save or Cancel */}
      <View style={recordFormStyles.saveContainer}>
        <Pressable style={recordFormStyles.btn} onPress={router.back}>
          <Text>Cancel</Text>
        </Pressable>
        <View style={{flex:2}}/>
        <Pressable style={recordFormStyles.btn} onPress={addRecord} disabled={!record.amount}>
          <Text>Add</Text>
        </Pressable>
      </View>

       {/* Type */}
      <View style={recordFormStyles.typeContainer}>
        <TypeButton type='income'/>
        <TypeButton type='expense'/>
        <TypeButton type='transfer'/>
      </View>
    
      {/* Date Picker */}
      <TouchableOpacity style={recordFormStyles.dateContainer} onPress={() => setOpenDatePicker(true)}>
        <Text  style={{flex:1, textAlign:'center'}}> {record.dateTime?.toDateString()} </Text>
        <Text> </Text>
        <Text style={{flex:1, textAlign:'center'}}>{record.dateTime?.toLocaleTimeString()} </Text>
        <DatePicker
          modal
          open={openDatePicker}
          date={record.dateTime}
          onConfirm={(date) => {
            setOpenDatePicker(false)
            setRecord({ ...record, dateTime: date })
          }}
          onCancel={() => {
            setOpenDatePicker(false)
            setRecord({ ...record })
          }}
        />
      </TouchableOpacity>

       {/* Input Ammount */}
      <View style={recordFormStyles.inputContainer}>
          <Text style={{flex:1, fontSize: 40, fontWeight: 'bold', textAlign: 'center'}}>
            {record.type==='expense'?"-":
              record.type==='income'?"+":""
              }</Text>
          <Text style={{flex:3, fontSize: 40, textAlign: 'right'}}>{record.amount?.toLocaleString('en-US')}</Text>
          <View style={{flex:1, paddingTop:10,alignItems:'center'}}>
            <Ionicons style={{flex:1}} name="mic-circle-sharp" size={24} color="black" />
            <Ionicons style={{flex:1}}name="camera" size={24} color="black" />
          </View>
      </View>

      {/* Category buttons */}
      <View style={recordFormStyles.typeContainer}>
        <View style={recordFormStyles.shadow}>
             <DropDownPicker
                      style={{borderWidth:0}}
                      open={openAccount}
                      value={account}
                      items={allAccounts}
                      setOpen={setOpenAccount}
                      setValue={setAccount}
                      setItems={setAllAccounts}
                      placeholder={'Account'}
                  />
        </View>
        <View style={recordFormStyles.shadow}>
            <DropDownPicker
                      style={{borderWidth:0}}
                      open={openCategory}
                      value={category}
                      items={allCategory}
                      setOpen={setOpenCategory}
                      setValue={setCategory}
                      setItems={setAllCategory}
                      placeholder={'Category'}
                  />
        </View>
      </View>

          
      
      

      {/* Notes */}

        <TextInput
          multiline
          numberOfLines={4}
          maxLength={200}
          style={recordFormStyles.note}  
          placeholder='Write notes here'
          value={record.note ?? ''}
          onChangeText={handleNoteChange}

        />


      {/* Number Pad */}
      <View style={numPadStyles.container}>
        <View style={[numPadStyles.inputContainer]}>
       
                <Text style={numPadStyles.input} >{input}</Text>
                <TouchableOpacity  style={numPadStyles.cancel} onPress={handleClear}>
                    <Ionicons name="backspace-outline" size={38} color="black" />
                </TouchableOpacity>
            
        </View>  
        {/* {result !== null && <Text style={numPadStyles.result}>Result: {result}</Text>} */}
        <View style={numPadStyles.row}>
          <NumPadKey keyLabel="+" />
          <NumPadKey keyLabel="7" />
          <NumPadKey keyLabel="8" />
          <NumPadKey keyLabel="9" />
        </View>
        <View style={numPadStyles.row}>
          <NumPadKey keyLabel="-" />
          <NumPadKey keyLabel="4" />
          <NumPadKey keyLabel="5" />
          <NumPadKey keyLabel="6" />
        </View>
        <View style={numPadStyles.row}>
          <NumPadKey keyLabel="*" />
          <NumPadKey keyLabel="1" />
          <NumPadKey keyLabel="2" />
          <NumPadKey keyLabel="3" />
        </View>
        <View style={numPadStyles.row}>
          <NumPadKey keyLabel="/" />
          <NumPadKey keyLabel="0" />
          <NumPadKey keyLabel="." />
          <TouchableOpacity style={numPadStyles.button} onPress={handleCalculate}>
            <Text style={numPadStyles.buttonText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewTransaction;