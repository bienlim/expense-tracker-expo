import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';


const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const data = [
    { category: 'Groceries', amount: 50 },
    { category: 'Rent', amount: 500 },
    { category: 'Utilities', amount: 100 },
    { category: 'Internet', amount: 60 },
  ];
  
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.amount),
      },
    ],
  };

const HorizontalBarChart = () => {
  
    const chartData = {
        labels: data.map(item => item.category),
        datasets: [
          {
            data: data.map(item => item.amount),
          },
        ],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Amount by Category</Text>
            <BarChart
            style={styles.chart}
            data={chartData}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero={true}
            showValuesOnTopOfBars={true}
            />
        </View>
        )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default HorizontalBarChart;