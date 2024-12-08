import { Transaction } from '@/hooks/useDB'
import { useState } from 'react'
import { View, Text } from 'react-native'

const newTransaction = () => {
  const [transaction, setTransaction] = useState<Transaction>()


  return (
    <View>
      <Text>newTransaction</Text>
    </View>
  )
}

export default newTransaction