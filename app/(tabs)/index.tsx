import { type Records, useDB } from '@/hooks/useDB';
import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text, FlatList, Button, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, TouchableOpacity, SectionList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, Pressable, TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { recordFormStyles } from '@/styles/recordFormStyles';
import HorizontalBarChart from '@/components/HorizontalBarChart';

  

interface recordByDate {
  date: string;
  data: Records[];
}

type searchFilterTotal = {
  [key: string]: {
    [key: string]: number
  }
}


export default function HomeScreen() {

  // # State
  const { getAllRecords } = useDB()
  const [transactions, setTransactions] = useState<Records[]>()
  const [recordByDate, setRecordByDate] = useState<recordByDate[] | undefined>()
  const [totalExpense, setTotalExpense] = useState<number>()
  const [totalIncome, setTotalIncome] = useState<number>()
  const [balance, setBalance] = useState<number>()
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false)
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(),
    endDate: new Date()
  })

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [filteredRecord, setFilteredRecord] = useState<Records[]>()

  const [searchFilterTotal, setSearchFilterTotal] = useState<searchFilterTotal>({
      'expense': {
          'Food': 0,
          'Transpo': 0,
        },
      'income': {
          'Salary': 0,
          'Business': 0,
        }
    })
  
  
  useFocusEffect(
    useCallback(() => {
      const loadAndCalculate = async () => {
        const loadedTransactions = await loadTransactions();
        const loadedExpenses = await calculateTotal(loadedTransactions, 'expense');
        const loadedIncome = await calculateTotal(loadedTransactions, 'income');
        calculateBalance(loadedExpenses, loadedIncome);
      };
      loadAndCalculate();
    }, [])
  );


  // # Actions

  const loadTransactions = async () => {
    const result = await getAllRecords()
    console.log('Transactions',result)
    setTransactions(result);
    setRecordByDate(groupByDate(result));
    return result;
  }

  const groupByDate = (data:Records[]) => {
    const groupedData = data.reduce((acc: { [key: string]: Records[] }, item) => {
      const date = new Date(item.dateTime).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  
    return Object.keys(groupedData).map((date) => ({
      date: date,
      data: groupedData[date],
    }));
  };

  const calculateTotal = (records: Records[],type:string,category?:string) => {
    const amount = (records ?? [])
      .filter((transaction) => type?transaction.type === type:true)
      .filter((transaction) => category?transaction.category === category:true)
      .reduce((acc, transaction) => acc + (transaction.amount || 0), 0)
      .toFixed(2);
    console.log('Total ', type,' ', category, amount)
    //setTotalExpense(Number.parseFloat(amount))
    return Number.parseFloat(amount)
  }

  const calculateBalance = async (loadedExpenses: number, loadedIncome: number) => {
    const balance = Number.parseFloat(Number((loadedIncome ?? 0) - (loadedExpenses ?? 0)).toFixed(2));
    console.log('Balance', balance)
    setBalance(balance)
  }

  const handleSearch = (text: string) => {
    console.log('Search', text)
      setSearchFilter(text)

      if (text === '') {
        setRecordByDate(groupByDate(transactions ?? []));
        setFilteredRecord(transactions);
        return;
      }
      
      const filtered = transactions?.filter((transaction) => {
        const date = new Date(transaction.dateTime).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return (
          transaction.account?.toLowerCase().includes(text.toLowerCase()) ||
          transaction.category?.toLowerCase().includes(text.toLowerCase()) ||
          transaction.note?.toLowerCase().includes(text.toLowerCase()) ||
          transaction.amount?.toString().includes(text) ||
          date.includes(text)
        );
      });
      setFilteredRecord(filtered);
      setRecordByDate(groupByDate(filtered ?? []));

      setSearchFilterTotal({...searchFilterTotal, 'expense': {
        'Food': calculateTotal(filtered ?? transactions ?? [],'expense','Food'),
        'Transpo': calculateTotal(filtered ?? transactions ?? [],'expense','Transpo'),
        'Entertainment': calculateTotal(filtered ?? transactions ?? [],'expense','Entertainment'),
      }})
    }


  const recordStats = (records:Records[],type:string, category:string) => {
    const filteredRecordForStarts = records?.filter((record) => record.type === type && record.category === category)
  }
  // # Components

  const transactionItem = ({ item }: { item: Records }) => (
    <Pressable style={styles.transaction} onPress={() => router.push(`/transaction?id=${item.id}`)}>
      <View style={styles.transactionDetails}>
        <Text style={styles.description}>{item.category}</Text>
        <Text style={styles.category}>{`${item.note?.substring(0, 40)}${item.note?.[41]?'...':''}`}</Text>
      </View>
      <View>
        <Text style={[styles.amount]}>
          {item.type === "expense" ? "-" : ""} P {item.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <Text style={{textAlign:'right',color:'grey'}}>
          {item.account}
        </Text>
      </View>
  </Pressable>
  );

  const sectionHeader = ({section: {date}}) => (
    <Text style={[styles.date,{textAlign:'center',borderBottomWidth:0.3,padding:4}]}>
          {new Date(date).toLocaleDateString('en-US',{
            year: 'numeric', // "2023"
            month: 'long', // "October"
            day: 'numeric', // "30"
          })}
        </Text>
  )

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>

        {/* Date Filter */}
        <View style={[styles.shadow,{flex:1,flexDirection: 'row', borderWidth:0, margin:5,alignItems:'center'}]}>
          
            <TouchableOpacity style={[{flex:3,margin:5,padding:5,borderRightWidth:0}]} onPress={() => setOpenStartDatePicker(true)}>
              <Text  style={{flex:1, textAlign:'center'}}> {dateFilter.startDate?.toLocaleString('en-US',{
                  year: 'numeric', // "2023"
                  month: 'long', // "October"
                  day: 'numeric', // "30"
                })}</Text>
              <DatePicker
                modal
                style={{flex:1,borderWidth:1}}
                open={openStartDatePicker}
                date={dateFilter.startDate}
                onConfirm={(date) => {
                  setOpenStartDatePicker(false)
                  setDateFilter({...dateFilter, startDate: date})
                }}
                mode='date'
                onCancel={() => {
                  setOpenStartDatePicker(false)
                }}
              />
            </TouchableOpacity>
            <Text>-</Text>
            <TouchableOpacity style={{flex:3,margin:5,padding:5,flexDirection:'row',alignItems:'center'}} onPress={() => setOpenEndDatePicker(true)}>
              <Text  style={{flex:1, textAlign:'center'}}> {dateFilter.endDate?.toLocaleString('en-US',{
                year: 'numeric', // "2023"
                month: 'long', // "October"
                day: 'numeric', // "30"
              })} </Text>
              <DatePicker
                modal
                style={{flex:1,borderWidth:1}}
                open={openEndDatePicker}
                date={dateFilter.endDate}
                onConfirm={(date) => {
                  setOpenEndDatePicker(false)
                  setDateFilter({...dateFilter, endDate: date})
                }}
                mode='date'
                onCancel={() => {
                  setOpenEndDatePicker(false)
                }}
              />
              <Ionicons style={{flex:0}} name="calendar-outline" size={20} color="black" />
            </TouchableOpacity>
        </View>
        

        {/* Search Filter */}

        <View style={{flex:1,flexDirection: 'row', borderWidth:0.2, margin:5, paddingHorizontal:8,alignItems:'center',borderRadius: 8}}>
          <TextInput style={{flex:9}} placeholder='Search' onChangeText={handleSearch}/>
          <Ionicons style={{flex:0}} name="search-outline" size={20} color="black" />
        </View>



        {/* Category / Type filter */}
        <View style={{flex:1,flexDirection: 'row', borderWidth:0.2, margin: 5, paddingHorizontal:5,alignItems:'center',borderRadius: 8,}}>
          <TouchableOpacity style={{flex:1}}>
            <Text>Income</Text>
          </TouchableOpacity>
          <Ionicons style={{flex:0}} name="filter-outline" size={20} color="black" />
        </View>

        {/* Summary chart */}
        
        <View style={styles.cardContainer}>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.text}>
              Income
            </Text>
            <Text style={[styles.text,{textAlign:'right'}]}>
              P {totalIncome?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{flex: totalExpense, backgroundColor: 'blue'}}/>
            <View style={{flex: totalIncome ,backgroundColor:'red'}}/>
          </View> 
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.text}>
              Expense
            </Text>
            <Text style={[styles.text,{textAlign:'right'}]}>
              P {totalIncome?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',borderRadius:8}}>
            <View style={{flex: totalExpense, backgroundColor: 'black'}}/>
            <View style={{flex: totalIncome ,backgroundColor:'red'}}/>
          </View> 
        </View>
        <View style={styles.ListContainer}>
            {/* <FlatList
              data={transactions}
              renderItem={transactionItem}
            /> */}
            {recordByDate && (
              <SectionList
                sections={recordByDate}
                keyExtractor={(item, index) => (item.id?.toString() ?? 'undefined') + index}
                renderItem={transactionItem}
                renderSectionHeader={sectionHeader}
              />
            )}
            <Pressable
              style={styles.addBtn}
              onPress={()=> router.push('/transaction')}
            >
              <Ionicons name="add-circle" size={60} color="black" />
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
    backgroundColor: '#f8f9fa',
  },
  cardContainer: {
    
    flex: 2,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 0,
  },
  ListContainer: {
    borderWidth: 0,
    flex: 10,
    backgroundColor: '#f8f9fa',
    margin: 4,
    marginBottom: 0,
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
    padding: 6,
    margin: 5,
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
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  addBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  shadow: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
  }

})