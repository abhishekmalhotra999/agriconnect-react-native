import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
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
import Button from '../../../components/UI/Button';
import {userContext} from '../../../contexts/UserContext';
import {
  getMarketplaceProductDetail,
} from '../../../api/marketplace.api';
import {getServiceListingDetail} from '../../../api/services.api';
import ErrorText from '../../../components/UI/ErrorText';
import {comingSoon} from '../../../constants/images';

const MyProductDetails: React.FC<MyProductDetailsScreenProps> = ({ route, navigation }) => {
  const { product }: { product: Product } = route.params;
  const {user} = userContext();
  const normalizedRole =
    (user?.accountType || user?.profile?.professionType || '').toLowerCase?.() ||
    '';
  const isTechnician = normalizedRole === 'technician';
  const [detailProduct, setDetailProduct] = useState<Product>(product);
  const [images, setImages] = useState<any[]>([product.image || comingSoon]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const result = isTechnician
          ? await getServiceListingDetail(Number(product.id))
          : await getMarketplaceProductDetail(Number(product.id));

        if (!mounted) {
          return;
        }

        setDetailProduct(result.product || product);
        const nextImages = Array.isArray(result.images) && result.images.length > 0
          ? result.images
          : [result.product?.image || product.image || comingSoon];
        setImages(nextImages);
      } catch (_error) {
        if (!mounted) {
          return;
        }
        setError('Unable to load product details right now.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      mounted = false;
    };
  }, [isTechnician, product]);

  function editProduct() {
    navigation.navigate('ManageMyProduct', {product: detailProduct});
  }

  return (
    <View style={styles.container}>
      <Header goBack={true} title={detailProduct.name}/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        >
        <Card>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <MyProductInfo product={detailProduct}/>
          )}
          {!!error && <ErrorText text={error} />}
          <Button
            label={isTechnician ? 'Edit Service' : 'Edit Product'}
            style={styles.editButton}
            labelStyle={styles.editButtonLabel}
            onPress={editProduct}
            disabled={false}
          />
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
  editButton: {
    marginTop: normalize(10),
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: normalize(30),
  },
  editButtonLabel: {
    color: COLORS.primary,
  },
});

export default MyProductDetails;