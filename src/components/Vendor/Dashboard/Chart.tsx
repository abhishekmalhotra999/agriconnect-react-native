import React, {useMemo} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from "react-native-chart-kit";
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../themes/spacing';

type ChartProps = {
  labels: string[];
  values: number[];
};

const chartConfig = {
  backgroundColor: COLORS.primaryLight,
  backgroundGradientFrom: COLORS.primary,
  backgroundGradientTo: COLORS.primaryDark,
  decimalPlaces: 2,
  propsForLabels: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
  },
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
}

const Chart: React.FC<ChartProps> = ({labels, values}) => {
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
        },
      ],
    }),
    [labels, values],
  );

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <BarChart
          style={styles.graphStyle}
          data={data}
          width={SCREEN_WIDTH / 1.09}
          height={SCREEN_HEIGHT / 3.5}
          yAxisSuffix=""
          yAxisInterval={1}
          yAxisLabel=""
          withInnerLines={false}
          chartConfig={chartConfig}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: normalize(-10),
  },
  wrapper: {
    overflow: 'hidden',
    borderRadius: normalize(12),
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  graphStyle: {
    marginTop: normalize(-30),
    paddingTop: normalize(25),
    borderRadius: normalize(12),
  },
  label: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    letterSpacing: 0.4,
  },
  value: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    letterSpacing: 0.6,
  },
});

export default Chart;