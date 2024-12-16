import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import type { Account } from '@/hooks/useDB';



type AccountItemProps = {
    account: string;
    isActive: boolean;
    onPress: () => void;
    transfer?: boolean;
}
type AccountListProps = {
    accounts: Account[];
    selectedAccount: string;
    handlePress: (account: string, accountId: number, transfer?:boolean) => void;
    title: string;
    transfer?: boolean;
    numColumns: number;
};
type AccountPickerProps = {
    accountFrom: string;
    accountTo: string;
    allAccounts: Account[];
    handleAccount: (account:string, account_id: number, transfer?:boolean) => void;
    transfer: boolean;
}

const AccountItem = ({account, isActive, onPress }: AccountItemProps) => (
    <TouchableOpacity
      style={isActive ? AccountPickerStyles.activeBtn : AccountPickerStyles.Btn}
      onPress={onPress}
    >
      <Text style={{ color: 'black', fontSize:16 }}>{account}</Text>
    </TouchableOpacity>
  );

const AccountList = ({ accounts, selectedAccount, handlePress, title , numColumns ,transfer}: AccountListProps) => {
    const renderItem = ({ item }: { item: Account }) => (
      <AccountItem
        account={item.account}
        isActive={item.account === selectedAccount}
        onPress={() => handlePress(item.account, item.id, transfer)}
      />
    );
  
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: 'center', fontSize: 18, color: 'grey', paddingBottom: 8 }}>{title}</Text>
        <FlatList
          data={accounts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    );
  };

const AccountPicker = ({ accountFrom, accountTo, allAccounts, handleAccount, transfer}: AccountPickerProps) => {
      return (
            <>
            {transfer ? (
                <View style={{ flexDirection: 'row', flex: 1 }}>
                <AccountList
                    accounts={allAccounts}
                    selectedAccount={accountFrom}
                    handlePress={handleAccount}
                    title="From Account"
                    numColumns={1}
                />
                <AccountList
                    accounts={allAccounts}
                    selectedAccount={accountTo}
                    handlePress={handleAccount}
                    title="To Account"
                    transfer={true}
                    numColumns={1}
                />
                </View>
            ) : (
                <AccountList
                accounts={allAccounts}
                selectedAccount={accountFrom}
                handlePress={handleAccount}
                title="Select Account"
                numColumns={2}
                />
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