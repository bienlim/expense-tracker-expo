import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { evaluate } from 'mathjs';
import { Ionicons } from '@expo/vector-icons';

export default function NumPad() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const handlePress = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const handleCalculate = () => {
    try {
      const evalResult = evaluate(input); // Note: Using eval can be dangerous. Use a proper math parser in production.
      setResult(evalResult);
    } catch (error) {
      setResult(null);
      alert('Invalid expression');
    }
  };

  const NumPadKey = ({ keyLabel }: { keyLabel: string }) => (
    <TouchableOpacity style={styles.button} onPress={() => handlePress(keyLabel)}>
      <Text style={styles.buttonText}>{keyLabel}</Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
        <View style={[styles.inputContainer]}>
       
                <Text style={styles.input} >{input}</Text>
                <TouchableOpacity  style={styles.cancel} onPress={handleCalculate}>
                    <Ionicons name="backspace-outline" size={32} color="black" />
                </TouchableOpacity>
            
        </View>  
      {/* {result !== null && <Text style={styles.result}>Result: {result}</Text>} */}
      <View style={styles.row}>
        <NumPadKey keyLabel="+" />
        <NumPadKey keyLabel="7" />
        <NumPadKey keyLabel="8" />
        <NumPadKey keyLabel="9" />
      </View>
      <View style={styles.row}>
        <NumPadKey keyLabel="-" />
        <NumPadKey keyLabel="4" />
        <NumPadKey keyLabel="5" />
        <NumPadKey keyLabel="6" />
      </View>
      <View style={styles.row}>
        <NumPadKey keyLabel="*" />
        <NumPadKey keyLabel="1" />
        <NumPadKey keyLabel="2" />
        <NumPadKey keyLabel="3" />
      </View>
      <View style={styles.row}>
        <NumPadKey keyLabel="/" />
        <NumPadKey keyLabel="0" />
        <NumPadKey keyLabel="." />
        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>=</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    padding: 15,
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
  },
});