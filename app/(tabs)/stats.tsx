import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router';
import { type Transaction, useDB } from '@/hooks/useDB';

const stats = () => {
    const { getAllTransactions } = useDB()
    const [totalFood, setTotalFood] = useState<number>()
    const [totalTransport, setTotalTransport] = useState<number>()
    const [totalEntertainment, setTotalEntertainment] = useState<number>()
    const [totalOthers, setTotalOthers] = useState<number>()

    useFocusEffect(
        useCallback(() => {
            const loadAndCalculate = async () => {
                const loadedTransactions = await loadTransactions();
                calculateTotalFood(loadedTransactions);
                calculateTotalTransport(loadedTransactions);
                calculateTotalEntertainment(loadedTransactions);
                calculateTotalOthers(loadedTransactions);
            };
            loadAndCalculate();
        }, [])
    );

        const loadTransactions = async () => {
            const result = await getAllTransactions()
            console.log('Transactions stats',result)
            return result;
        }

        const calculateTotalFood = async (loadedTransactions: Transaction[]) => {
        console.log('loadedTransactions', loadedTransactions)
        console.log('loadedTransactions', loadedTransactions.filter((transaction) => { return transaction.type=== 'expense' && transaction.category === 'Food'}))
        const amount = (loadedTransactions ?? [])
            .filter((transaction) => { return transaction.type=== 'expense' && transaction.category === 'Food'})
            .reduce((acc, transaction) => acc + (transaction.amount || 0), 0)
            .toFixed(2);
        console.log('Total Food', amount)
        setTotalFood(Number.parseFloat(amount))
        return Number.parseFloat(amount)
        }

        const calculateTotalTransport = async (loadedTransactions: Transaction[]) => {
        const amount = (loadedTransactions ?? [])
            .filter((transaction) => {return transaction.type=== 'expense' && transaction.category === 'Transport'})
            .reduce((acc, transaction) => acc + (transaction.amount || 0), 0)
            .toFixed(2)
        console.log('Total Transport', amount)
        setTotalTransport(Number.parseFloat(amount))
        return Number.parseFloat(amount)
        }

        const calculateTotalEntertainment = async (loadedTransactions: Transaction[]) => {
            const amount = (loadedTransactions ?? [])
                .filter((transaction) => { return transaction.type=== 'expense' && transaction.category === 'Entertainment'})
                .reduce((acc, transaction) => acc + (transaction.amount || 0), 0)
                .toFixed(2)
            console.log('Total Entertainment', amount)
            setTotalEntertainment(Number.parseFloat(amount))
            return Number.parseFloat(amount)
        }

        const calculateTotalOthers = async (loadedTransactions: Transaction[]) => {
            const amount = (loadedTransactions ?? [])
                .filter((transaction) => { return transaction.type=== 'expense' && transaction.category === 'Others'})
                .reduce((acc, transaction) => acc + (transaction.amount || 0), 0)
                .toFixed(2)
            console.log('Total Others', amount)
            setTotalOthers(Number.parseFloat(amount))
            return Number.parseFloat(amount)
        }
        
        return (
            <SafeAreaView style={styles.container}>
              <View style={styles.card}>
                <Text style={styles.title}>Total Food</Text>
                <Text style={styles.amount}>{totalFood?.toLocaleString()}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>Total Transport</Text>
                <Text style={styles.amount}>{totalTransport?.toLocaleString()}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>Total Entertainment</Text>
                <Text style={styles.amount}>{totalEntertainment?.toLocaleString()}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>Total Others</Text>
                <Text style={styles.amount}>{totalOthers?.toLocaleString()}</Text>
              </View>
            </SafeAreaView>
          );
        };
        
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            padding: 20,
            backgroundColor: '#f8f9fa',
          },
          card: {
            backgroundColor: '#ffffff',
            borderRadius: 8,
            padding: 16,
            marginVertical: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 2,
          },
          title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
          },
          amount: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#007bff',
            marginTop: 8,
          },
        });


export default stats