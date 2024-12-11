import { StyleSheet } from "react-native";


export const numPadStyles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#f8f9fa',
        },
        inputContainer: { 
          flexDirection: 'row', 
          width: 360,
          padding: 10,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          marginBottom: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
          justifyContent: 'flex-end',
          alignItems: 'center',
        },
        input: {
          flex: 7,
          alignItems: 'center',
          color: '#333',
          textAlign: 'right', // Align text to the right
          fontSize: 18,
        },
        cancel: {
          flex: 1,
          alignItems: 'center',
          paddingHorizontal:10,
        },
        result: {
          fontSize: 24,
          marginBottom: 20,
          color: '#007bff',
        },
        row: {
          flexDirection: 'row',
          marginBottom: 10,
        },
        button: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          margin: 5,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
        },
        buttonText: {
          fontSize: 24,
          color: '#333',
        },
        calculateButton: {
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          marginTop: 20,
          backgroundColor: '#007bff',
          borderRadius: 8,
          width: '100%',
        },
        calculateButtonText: {
          fontSize: 24,
          color: '#ffffff',
        }
      })
