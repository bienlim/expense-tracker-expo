import type { Transaction } from '@/hooks/useDB'
import { View, Text, StyleSheet, TextInput } from 'react-native'

type Props = {
  title: string,
  value?: string,
  onChange?: () => void,
  autoFocus?: boolean;
}

const InputForm = ({ title, value, onChange, autoFocus}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        autoFocus={autoFocus}
      />
    </View>
  );
};


const styles = StyleSheet.create({
    container:{
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

export default InputForm