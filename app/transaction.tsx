import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Pressable, TouchableOpacity, Keyboard} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { type Account, type Category, type Records, useDB } from '@/hooks/useDB';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recordFormStyles } from '@/styles/recordFormStyles';
import { numPadStyles } from '@/styles/numPadStyles';
import { Ionicons } from '@expo/vector-icons';
import { evaluate } from 'mathjs';
import DropDownPicker from 'react-native-dropdown-picker';
import NumPad from '@/components/NumPad';
import CategoryPicker from '@/components/CategoryPicker';
import AccountPicker from '@/components/AccountPicker';


const NewTransaction = () => {
  // # Hooks
  const {id} = useLocalSearchParams()
  const { insertRecord, getAllCategory, getAllAccount, getRecord, updateRecord } = useDB();

  // Initilize record if id is provided
  useEffect(() => {
    if (id) {
      const loadTransaction = async () => {
        const result = await getRecord(+id);
        console.log('Transaction inital ID', result);

        setRecord({ ...result, dateTime: new Date(result.dateTime) });
      };
      loadTransaction();
    }
  },[id, getRecord])

  // # State
  const [record, setRecord] = useState<Records>({
    type: 'expense',
    dateTime: new Date(),
  });
  const [calculatorInput, setCalculatorInput] = useState<string>('');

  
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false)

  const [openAccount, setOpenAccount] = useState<boolean>(false);  
  const [accountId, setAccountId] = useState<number>();
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
 

  const [accountTo, setAccountTo] = useState<{account?:string, account_id?: number}>({
    // account: 'BDO',
    // account_id: 3
  });

  const [openCategory, setOpenCategory] = useState(false);
  const [allCategory, setAllCategory] = useState<Category[]>([]);

  useEffect(() => {
    getAccounts();
  },[])

  useEffect(() => {
    getCategories(record.type);
  },[record.type])



  // Actions

  const handleSave = async () => {
    console.log('Record', record);
    console.log('accounTo', accountTo);
    if (id) {
      await updateRecord({...record, account_id: accountId, category_id: categoryId});
    } else {

      if(record.type === 'transfer'){
        await insertRecord({...record, amount: -record.amount, category_id: 12});
        await insertRecord({...record, amount: record.amount, category_id: 12});
      } else if (record.type === 'expense') {
      await insertRecord({...record, amount: -record.amount});
      } else {
        await insertRecord({...record})
      }
    }
    console.log('Record added', record);
    router.back();
  };

  const handlePress = (value: string) => {

    Keyboard.dismiss();
    
    // # Avoid sequential operators
    const lastChar = calculatorInput.at(-1) ?? '';
    const isOperator = ['+','-','*','/'].includes(value);
    const isLastCharOperator = ['+','-','*','/',"."].includes(lastChar);
    const isMultiplePeriods = value === '.' && calculatorInput.replace(/[0-9]/g, '').at(-1) === '.';

    const newInput = isOperator && isLastCharOperator
    ? calculatorInput.slice(0, -1) + value
    : isMultiplePeriods
    ? calculatorInput
    : calculatorInput + value;

    setCalculatorInput(newInput);
    handleCalculate(newInput);
      
    console.log('transaction', record.amount)
  };

  const handleClear = () => {
    Keyboard.dismiss();
    const newInput = calculatorInput.slice(0, -1);
    setCalculatorInput(newInput);
    handleCalculate(newInput);
  };

  const handleCalculate = (input:string) => {
    try {
      const evalResult = evaluate(input).toFixed(2); 
      setRecord({ ...record, amount: evalResult});
    } catch (error) {
      setRecord({ ...record, amount: null});
    }
  };

  const handleCategory = (category:string, category_id: number) => {
    setRecord({ ...record, category, category_id });
  }

  const getCategories = async (type:Records['type']) => {
    const result = await getAllCategory(type)
    console.log('Categories',result)
    setAllCategory(result);
  }

  const handleAccount = (account:string, account_id: number, transfer?:boolean) => {
    if(transfer){
      setAccountTo({ account, account_id });  
    } else {
      setRecord({ ...record, account, account_id });
    }
    if(record.type === 'transfer'){
      if (transfer ? record.account : accountTo.account) {
        setOpenAccount(false);
      }
    } else {
      setOpenAccount(false);
    } 
  }

  const getAccounts = async () => {
    const result = await getAllAccount()
    console.log('Accounts',result)
    setAllAccounts(result);
  }
  
  // # Sub-components
  const TypeButton = ({type}:{type:Records['type']}) => (
      <Pressable 
        style={
           
          record.type === type ? recordFormStyles.typeActiveBtn : recordFormStyles.typeBtn
        } 
        onPress={() => { setRecord({ ...record, type, category: undefined,category_id: undefined } )}}
        >
          <Text>{type}</Text>
      </Pressable>
  )

  return (
    <SafeAreaView style={recordFormStyles.container}>

      {/* Save or Cancel */}
      <View style={recordFormStyles.saveContainer}>
        <Pressable style={recordFormStyles.btn} onPress={router.back}>
          <Text>Cancel</Text>
        </Pressable>
        <View style={{flex:2}}/>
        <Pressable style={recordFormStyles.btn} onPress={handleSave} disabled={!record.amount}>
          <Text>{id ? 'Update' : 'Save'}</Text>
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

      {/* Account and Category buttons */}
      <View style={[recordFormStyles.typeContainer, {borderWidth:1, height: 50}]}>
        <View style={recordFormStyles.shadow}>
          <TouchableOpacity 
                  style={{flex:1,borderWidth:0,alignItems:'center',justifyContent:'center', borderRadius:8}}
                  onPress={() => {
                      setOpenAccount(!openAccount);
                      setOpenCategory(false);}}
                > 
                  <Text style={{fontSize:16}}>{record.account ?? 'Select Account'}</Text>
          </TouchableOpacity>
        </View>
        { record.type === 'income'? (
          <Ionicons name='caret-back-outline' size={24} color='black'/>
        ):(
          <Ionicons name='caret-forward-outline' size={24} color='black'/>
        )}
        <View style={recordFormStyles.shadow}>
            { record.type === 'transfer'?
              <TouchableOpacity 
                style={{flex:1,borderWidth:0,alignItems:'center',justifyContent:'center', borderRadius:8}}
                onPress={() => 
                  setOpenAccount(!openAccount)}
                > 
                <Text style={{fontSize:16}}>{accountTo.account ?? 'Select Account'}</Text>
              </TouchableOpacity>
              :
              
              <TouchableOpacity 
                style={{flex:1,borderWidth:0,alignItems:'center',justifyContent:'center', borderRadius:8}}
                onPress={() => {
                  setOpenCategory(!openCategory);
                  setOpenAccount(false);}}
              > 
                <Text style={{fontSize:16}}>{record.category ?? 'Select Category'}</Text>
              </TouchableOpacity>}
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
          onChangeText={(note) => setRecord({ ...record, note })}

        />

      {/* Number Pad */}
      {/* <NumPad calculatorInput={calculatorInput} handlePress={handlePress} handleClear={handleClear} /> */}
      <View style={{flex:1, width: '100%'}}>
      { openAccount ?
        <AccountPicker 
          accountFrom={record.account ?? ''} 
          accountTo={accountTo?.account ?? ''} 
          allAccounts={allAccounts} 
          handleAccount={handleAccount} 
          transfer={record.type==='transfer'}
          
          />:
        openCategory ?
        <CategoryPicker category={record.category ?? ''} allCategory={allCategory} handleCategory={handleCategory} setOpen={setOpenCategory}/>:
        <NumPad calculatorInput={calculatorInput} handlePress={handlePress} handleClear={handleClear} />
      }
     </View>
      
    </SafeAreaView>
  );
};

export default NewTransaction;