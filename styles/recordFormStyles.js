import { StyleSheet } from "react-native";

export const recordFormStyles = StyleSheet.create({ 
        container:{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
        },
        inputContainer:{
          flexDirection: 'row',
          height: 100,
          width: '100%',
          marginBottom: 0,
          alignItems: 'center',
        },
        note:{
          flexDirection: 'row',
          paddingHorizontal: 15,
          height: 80,
          width: '100%',
          marginVertical: 10,
          borderWidth: 0.2,
        },
        dateContainer:{
          flexDirection: 'row',
          padding: 12,
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 15,
          backgroundColor: 'white',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
        },
        typeContainer:{
          flexDirection: 'row',
          borderWidth: 0.2,
          borderColor: '#ffffff',
          marginHorizontal: 10,
          alignItems: 'center',
        },
        typeActiveBtn:{
          flex: 1,
          padding: 12,
          justifyContent: 'center',
          alignItems: 'center', 
          margin: 5,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
        },
        typeBtn:{
          flex: 1,
          padding: 12,
          justifyContent: 'center',
          alignItems: 'center', 
          margin: 5,
          
        },
        accBtn:{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center', 
          marginHorizontal: 5,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
        },
        text:{
          flex: 1,
          paddingVertical: 13,
          alignContent: 'center',  
          justifyContent: 'flex-start',
        },
        input:{
          flex: 4,
         
          padding: 10,
          borderRadius: 8,
        },
        datePicker: {
          width: '100%',
        },
        btn: {
          flex: 1,
          fontWeight: 'bold',
          margin: 0,
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
        saveContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom:10,
          borderBottomWidth: 0.2,
        },
        shadow:{
          borderRadius: 8,
          backgroundColor: '#ffffff',
          flex:1,
          marginHorizontal: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 1,
          zIndex: 1,
        },
});