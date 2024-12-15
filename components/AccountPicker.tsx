import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { numPadStyles } from '@/styles/numPadStyles';
import type { Account } from '@/hooks/useDB';

type AccountPickerProps = {
    accountFrom: string;
    accountTo: string;
    allAccounts: Account[];
    handleAccount: (account:string, account_id: number) => void;
    setOpen: (open: boolean) => void;
    transfer: boolean;
}

const AccountPicker = ({ accountFrom, accountTo, allAccounts, handleAccount, setOpen, transfer}: AccountPickerProps) => {
    console.log('AccountPicker',  allAccounts)
    const handlePress = (account:string, id:number) => {
        handleAccount(account, id )
        setOpen(false);
    }    
    const renderItem = ({ item }: { item: Account }) => (
        <TouchableOpacity
          style={item.account === accountTo? AccountPickerStyles.activeBtn : AccountPickerStyles.Btn} // Added styles for visibility
          onPress={() => handlePress(item.account, item.id)}
        >
          <Text style={{ color: 'black', fontSize:16 }}>{item.account}</Text>
        </TouchableOpacity>
      );
    
      return (
            <>
            {
            transfer? (
                <View style={{ flexDirection: 'row', flex: 1, borderWidth: 1 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ textAlign: 'center', fontSize: 18, color: 'grey', paddingBottom: 8 }}>From Account</Text>
                      <FlatList
                        data={allAccounts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={1}
                    />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ textAlign: 'center', fontSize: 18, color: 'grey', paddingBottom: 8 }}>To Account</Text>
                      <FlatList
                        data={allAccounts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={1}
                    />
                    </View>
                  </View>
            ) : (
                <View>
                <Text style={{textAlign:'center', fontSize: 18, color:'grey', paddingBottom:8}}>Select Account</Text>
                    <FlatList
                        data={allAccounts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                    />
                </View>
            )}
            </>
      );
  }


const AccountPickerStyles = StyleSheet.create({

    activeBtn: { 
        flex:1,
        margin: 5, padding: 12,  alignItems: 'flex-start' ,
        backgroundColor: '#ffffff', // Added styles for visibility
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    Btn: {
        flex:1, 
        margin: 5, padding: 12,  alignItems: 'flex-start' ,
        borderWidth: 0.4,
        borderColor: 'lightgrey',
        borderRadius: 8,
    }

})

export default AccountPicker