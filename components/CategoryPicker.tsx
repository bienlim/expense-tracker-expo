import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { numPadStyles } from '@/styles/numPadStyles';
import type { Category } from '@/hooks/useDB';

type CategoryPickerProps = {
    category: string;
    allCategory: Category[];
    handleCategory: (category:string, category_id: number) => void;
    setOpen: (setOpenCategory: boolean) => void;
}

const CategoryPicker = ({ category, allCategory, handleCategory, setOpen }: CategoryPickerProps) => {

    const handlePress = (category:string, id:number) => {
        handleCategory(category, id )
        setOpen(false);
    }    
    const renderItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
          style={item.category === category? CategorPrickerStyles.activeBtn : CategorPrickerStyles.Btn} // Added styles for visibility
          onPress={() => handlePress(item.category, item.id)}
        >
          <Text style={{ color: 'black', fontSize:16 }}>{item.category}</Text>
        </TouchableOpacity>
      );
    
      return (
        <View style={{ marginHorizontal: 8 }}>
            <Text style={{textAlign:'center', fontSize: 18, color:'grey', paddingBottom:8}}>Select Category</Text>
          <FlatList
            data={allCategory}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
          />
        </View>
      );
  }


const CategorPrickerStyles = StyleSheet.create({

    activeBtn: { 
        width: '50%', 
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
        width: '50%', 
        margin: 5, padding: 12,  alignItems: 'flex-start' ,
        borderWidth: 0.4,
        borderColor: 'lightgrey',
        borderRadius: 8,
    }

})

export default CategoryPicker