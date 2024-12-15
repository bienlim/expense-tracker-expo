import { View, Text, TouchableOpacity } from 'react-native'

type OptionItem = {
    label: string;
    value: string;
};

interface DropDownPickerProps {
    data: OptionItem[];
}

export default function DropDownPicker({
    data
}) {
    


  return (
    <View>
      <Text>DropDownPicker</Text>
      <TouchableOpacity onPress={() => {}}>
        <Text>Press me</Text>
      </TouchableOpacity>
    </View>
  )
}
