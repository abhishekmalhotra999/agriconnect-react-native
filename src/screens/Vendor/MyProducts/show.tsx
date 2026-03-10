import React from 'react';
import { StyleSheet, View, ScrollView, Platform, Image } from 'react-native';
import { MyProductDetailsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import { Product } from '../../../models/Product';
import Card from '../../../components/UI/Card';
import MyProductInfo from '../../../components/Vendor/MyProduct/MyProductInfo';
import List from '../../../components/UI/List';
import FastImage from '@d11/react-native-fast-image';
import Separator from '../../../components/UI/Separator';
import { listItem1, listItem2, listItem3 } from '../../../constants/images';

const images = [listItem1, listItem2, listItem3, listItem1, listItem2]

const MyProductDetails: React.FC<MyProductDetailsScreenProps> = ({ route }) => {
  const { product }: { product: Product } = route.params;

  return (
    <View style={styles.container}>
      <Header goBack={true} title={product.name}/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        >
        <Card>
          <MyProductInfo product={product}/>
        </Card>
        <Separator/>
        <Card style={styles.imageCardStyle}>
          <List
            nestedScrollEnabled
            scrollEnabled={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={images}
            renderItem={({ item }) => (
              <Image
                source={item}
                style={styles.productImage}
                resizeMode={FastImage.resizeMode.contain}
              />
            )}
            separatorStyle={styles.separator}
            keyExtractor={(item, index) => index.toString()}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: normalize(16),
    paddingBottom: normalize(120),
  },
  imageCardStyle: {
    paddingHorizontal: 0,
  },
  productImage: {
    width: 100,
    height: 100,
  },
  separator: {
    paddingRight: normalize(10),
  },
});

export default MyProductDetails;