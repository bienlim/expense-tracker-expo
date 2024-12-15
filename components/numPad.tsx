import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { numPadStyles } from '@/styles/numPadStyles';

type NumPadKeyProps = {
  keyLabel: string;
  onPress: (keyLabel: string) => void;
}

type NumPadProps = {
  calculatorInput: string;
  handlePress: (keyLabel: string) => void;
  handleClear: () => void;
}

const NumPadKey =  ({ keyLabel, onPress }: NumPadKeyProps) => (
  <TouchableOpacity style={numPadStyles.button} onPress={() => onPress(keyLabel)}>
    <Text style={numPadStyles.buttonText}>{keyLabel}</Text>
  </TouchableOpacity>
);

const NumPad = ({ calculatorInput, handlePress, handleClear }: NumPadProps) => (
  <View style={numPadStyles.container}>
    <View style={numPadStyles.inputContainer}>
      <Text style={numPadStyles.input}>{calculatorInput}</Text>
      <TouchableOpacity style={numPadStyles.cancel} onPress={handleClear}>
        <Ionicons name="backspace-outline" size={38} color="black" />
      </TouchableOpacity>
    </View>
    <View style={numPadStyles.row}>
      <NumPadKey keyLabel="+" onPress={handlePress} />
      <NumPadKey keyLabel="7" onPress={handlePress} />
      <NumPadKey keyLabel="8" onPress={handlePress} />
      <NumPadKey keyLabel="9" onPress={handlePress} />
    </View>
    <View style={numPadStyles.row}>
      <NumPadKey keyLabel="-" onPress={handlePress} />
      <NumPadKey keyLabel="4" onPress={handlePress} />
      <NumPadKey keyLabel="5" onPress={handlePress} />
      <NumPadKey keyLabel="6" onPress={handlePress} />
    </View>
    <View style={numPadStyles.row}>
      <NumPadKey keyLabel="*" onPress={handlePress} />
      <NumPadKey keyLabel="1" onPress={handlePress} />
      <NumPadKey keyLabel="2" onPress={handlePress} />
      <NumPadKey keyLabel="3" onPress={handlePress} />
    </View>
    <View style={numPadStyles.row}>
      <NumPadKey keyLabel="/" onPress={handlePress} />
      <NumPadKey keyLabel="0" onPress={handlePress} />
      <NumPadKey keyLabel="." onPress={handlePress} />
      <NumPadKey keyLabel="=" onPress={handlePress} />
    </View>
  </View>
);

export default NumPad;