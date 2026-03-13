import React, {useEffect, useMemo, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../../containers/header';
import {ManageMyProductScreenProps} from '../../../navigation/types';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import Card from '../../../components/UI/Card';
import Input from '../../../components/UI/Input';
import Button from '../../../components/UI/Button';
import ErrorText from '../../../components/UI/ErrorText';
import Separator from '../../../components/UI/Separator';
import {
  createMarketplaceProduct,
  getMarketplaceProductDetail,
  updateMarketplaceProduct,
} from '../../../api/marketplace.api';
import {
  createServiceListing,
  getServiceCategories,
  getServiceListingDetail,
  ServiceCategoryOption,
  updateServiceListing,
} from '../../../api/services.api';
import {userContext} from '../../../contexts/UserContext';
import {launchImageLibrary} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const parseCurrencyValue = (value: string) => {
  const numeric = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return isNaN(numeric) ? 0 : numeric;
};

const sanitizeDecimalInput = (value: string): string => {
  const cleaned = String(value || '').replace(/[^0-9.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot === -1) {
    return cleaned;
  }

  const integerPart = cleaned.slice(0, firstDot + 1);
  const decimalPart = cleaned
    .slice(firstDot + 1)
    .replace(/\./g, '')
    .slice(0, 2);

  return `${integerPart}${decimalPart}`;
};

const sanitizeIntegerInput = (value: string): string => {
  return String(value || '').replace(/[^0-9]/g, '');
};

type UploadImage = {
  uri: string;
  type?: string;
  fileName?: string;
  isRemote?: boolean;
};

const ManageMyProduct: React.FC<ManageMyProductScreenProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const product = route.params?.product;
  const isEdit = !!product;
  const {user} = userContext();
  const normalizedRole =
    (user?.accountType || user?.profile?.professionType || '').toLowerCase?.() ||
    '';
  const isTechnician = normalizedRole === 'technician';

  const [title, setTitle] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [unitPrice, setUnitPrice] = useState(product?.price || '');
  const [salePrice, setSalePrice] = useState(product?.discountedPrice || '');
  const [stockQuantity, setStockQuantity] = useState(
    String(product?.stockQuantity ?? (product?.inStock ? 1 : 0)),
  );
  const [thumbnailImage, setThumbnailImage] = useState<UploadImage | null>(
    product?.imageUrl
      ? {
          uri: product.imageUrl,
          type: 'image/jpeg',
          fileName: 'thumbnail.jpg',
        }
      : null,
  );
  const [galleryImages, setGalleryImages] = useState<UploadImage[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>(
    product?.status === 'published' ? 'published' : 'draft',
  );
  const [serviceCategories, setServiceCategories] = useState<ServiceCategoryOption[]>([]);
  const [serviceCategoryId, setServiceCategoryId] = useState(
    product?.categoryId ? String(product.categoryId) : '',
  );
  const [serviceArea, setServiceArea] = useState(product?.serviceArea || '');
  const [contactEmail, setContactEmail] = useState(
    product?.contactEmail || user?.email || '',
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pageTitle = useMemo(() => {
    if (isTechnician) {
      return isEdit ? 'Edit Service' : 'Create Service';
    }
    return isEdit ? 'Edit Product' : 'Create Product';
  }, [isEdit, isTechnician]);

  useEffect(() => {
    let mounted = true;

    if (!isTechnician) {
      return;
    }

    getServiceCategories()
      .then(rows => {
        if (!mounted) {
          return;
        }
        setServiceCategories(rows);
      })
      .catch(() => {
        if (mounted) {
          setServiceCategories([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, [isTechnician]);

  useEffect(() => {
    let mounted = true;

    if (!isEdit || !product?.id) {
      return;
    }

    const loadExistingMedia = async () => {
      try {
        const detail = isTechnician
          ? await getServiceListingDetail(Number(product.id))
          : await getMarketplaceProductDetail(Number(product.id));

        if (!mounted) {
          return;
        }

        const remoteThumb = String(detail?.product?.imageUrl || '').trim();
        if (remoteThumb) {
          setThumbnailImage({
            uri: remoteThumb,
            type: 'image/jpeg',
            fileName: 'existing-thumbnail.jpg',
            isRemote: true,
          });
        }

        const remoteGallery = Array.isArray((detail as any)?.galleryUrls)
          ? (detail as any).galleryUrls
          : [];
        const normalizedGallery = remoteGallery
          .map((uri: string, index: number) => ({
            uri: String(uri || '').trim(),
            type: 'image/jpeg',
            fileName: `existing-gallery-${index + 1}.jpg`,
            isRemote: true,
          }))
          .filter((item: UploadImage) => Boolean(item.uri));

        setGalleryImages(normalizedGallery);
      } catch {
        if (mounted) {
          setGalleryImages([]);
        }
      }
    };

    loadExistingMedia();

    return () => {
      mounted = false;
    };
  }, [isEdit, isTechnician, product?.id]);

  const submitProduct = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!isTechnician && status === 'published' && !thumbnailImage?.uri) {
      setError('Thumbnail image is required before publishing.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        title: title.trim(),
        description: description.trim(),
        unitPrice: parseCurrencyValue(unitPrice),
        salePrice: parseCurrencyValue(salePrice),
        stockQuantity: Number(stockQuantity || 0),
        status,
        mainPictureUrl: thumbnailImage?.isRemote ? thumbnailImage.uri : undefined,
        mainPictureFile: thumbnailImage?.isRemote ? undefined : thumbnailImage || undefined,
        galleryUrls: galleryImages
          .filter(image => image.isRemote)
          .map(image => image.uri),
        galleryFiles: galleryImages.filter(image => !image.isRemote),
      };

      if (isTechnician) {
        const thumbnailUri = String(thumbnailImage?.uri || '');
        const remoteThumbnail =
          thumbnailUri.startsWith('http://') || thumbnailUri.startsWith('https://');

        const servicePayload = {
          title: title.trim(),
          description: description.trim(),
          serviceCategoryId: serviceCategoryId ? Number(serviceCategoryId) : undefined,
          serviceArea: serviceArea.trim(),
          contactEmail: contactEmail.trim(),
          isActive: status === 'published',
          mainPictureUrl: remoteThumbnail ? thumbnailUri : undefined,
          mainPictureFile: !remoteThumbnail ? thumbnailImage || undefined : undefined,
          galleryUrls: galleryImages
            .filter(image => image.isRemote)
            .map(image => image.uri),
          galleryFiles: galleryImages.filter(image => !image.isRemote),
        };

        if (isEdit && product?.id) {
          await updateServiceListing(Number(product.id), servicePayload);
        } else {
          await createServiceListing(servicePayload);
        }
      } else {
        if (isEdit && product?.id) {
          await updateMarketplaceProduct(Number(product.id), payload);
        } else {
          await createMarketplaceProduct(payload);
        }
      }

      setStatus(status);

      navigation.goBack();
    } catch (apiError: any) {
      setError(
        apiError?.message ||
          (isTechnician ? 'Unable to save service.' : 'Unable to save product.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openImagePicker = async (multiple = false): Promise<UploadImage[]> => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: multiple ? 8 : 1,
      quality: 0.9,
    });

    if (result.didCancel || !Array.isArray(result.assets)) {
      return [];
    }

    return result.assets
      .filter(asset => Boolean(asset.uri))
      .map(asset => ({
        uri: asset.uri as string,
        type: asset.type,
        fileName: asset.fileName,
        isRemote: false,
      }));
  };

  const pickThumbnail = async () => {
    const selected = await openImagePicker(false);
    if (selected.length > 0) {
      setThumbnailImage(selected[0]);
    }
  };

  const pickGallery = async () => {
    const selected = await openImagePicker(true);
    if (selected.length > 0) {
      setGalleryImages(prev => [...prev, ...selected].slice(0, 8));
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const clearThumbnail = () => {
    setThumbnailImage(null);
  };

  return (
    <View style={styles.container}>
      <Header
        goBack
        title={pageTitle}
        showButtons={false}
        otherTextStyle={{}}
        icons
      />
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.content,
          {paddingBottom: normalize(20)},
        ]}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={normalize(24)}>
        <Card style={styles.formCard}>
          <Text style={styles.pageHeading}>{pageTitle}</Text>
          <Text style={styles.pageSubHeading}>
            {isTechnician
              ? 'Create and manage your service listing details.'
              : 'Upload your product images and complete details below.'}
          </Text>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {isTechnician ? 'Service Media' : 'Product Media'}
            </Text>
          </View>

          <Text style={styles.fieldLabel}>Thumbnail Image</Text>
          <Text style={styles.helperText}>Used on product cards and listing previews.</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickThumbnail}>
            <Text style={styles.uploadButtonText}>
              {thumbnailImage?.uri ? 'Replace Thumbnail' : 'Upload Thumbnail'}
            </Text>
          </TouchableOpacity>
          {thumbnailImage?.uri ? (
            <View>
              <Image source={{uri: thumbnailImage.uri}} style={styles.thumbnailPreview} />
              <TouchableOpacity style={styles.clearButton} onPress={clearThumbnail}>
                <Text style={styles.clearButtonText}>Remove Thumbnail</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <Text style={styles.fieldLabel}>Gallery Images</Text>
          <Text style={styles.helperText}>Upload up to 8 extra images for detail view.</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickGallery}>
            <Text style={styles.uploadButtonText}>Upload Gallery Images</Text>
          </TouchableOpacity>
          <Text style={styles.galleryCount}>{galleryImages.length}/8 selected</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.galleryRow}>
              {galleryImages.length === 0 ? (
                <View style={styles.emptyGalleryCard}>
                  <Text style={styles.emptyGalleryText}>No gallery images selected</Text>
                </View>
              ) : null}
              {galleryImages.map((image, index) => (
                <View key={`${image.uri}-${index}`} style={styles.galleryItem}>
                  <Image source={{uri: image.uri}} style={styles.galleryPreview} />
                  <TouchableOpacity
                    style={styles.removeBadge}
                    onPress={() => removeGalleryImage(index)}>
                    <Text style={styles.removeBadgeText}>x</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Basic Details</Text>
          </View>

          <Text style={styles.fieldLabel}>{isTechnician ? 'Service Title' : 'Product Title'}</Text>
          <Input
            placeholder={isTechnician ? 'Enter service title' : 'Enter product title'}
            value={title}
            onChangeText={setTitle}
            inputStyle={styles.fieldInput}
          />

          {isTechnician ? (
            <>
              <Text style={styles.fieldLabel}>Service Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryRow}>
                  {serviceCategories.map(item => {
                    const active = String(item.id) === String(serviceCategoryId);
                    return (
                      <TouchableOpacity
                        key={String(item.id)}
                        onPress={() => setServiceCategoryId(String(item.id))}
                        style={[styles.categoryChip, active && styles.categoryChipActive]}>
                        <Text
                          style={[
                            styles.categoryChipText,
                            active && styles.categoryChipTextActive,
                          ]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              <Text style={styles.fieldLabel}>Service Area</Text>
              <Input
                placeholder="e.g. Montserrado, Bong"
                value={serviceArea}
                onChangeText={setServiceArea}
                inputStyle={styles.fieldInput}
              />

              <Text style={styles.fieldLabel}>Contact Email</Text>
              <Input
                placeholder="Contact email"
                value={contactEmail}
                onChangeText={setContactEmail}
                inputStyle={styles.fieldInput}
              />
            </>
          ) : null}

          <Text style={styles.fieldLabel}>Description</Text>
          <Input
            placeholder="Describe the product"
            value={description}
            onChangeText={setDescription}
            inputStyle={styles.fieldInput}
          />

          {!isTechnician ? (
            <>
              <Text style={styles.fieldLabel}>Price</Text>
              <Input
                placeholder="Price (e.g. 100)"
                keyboardType="numeric"
                value={unitPrice}
                onChangeText={value => setUnitPrice(sanitizeDecimalInput(value))}
                editable={!isTechnician}
                inputStyle={styles.fieldInput}
              />

              <Text style={styles.fieldLabel}>Sale Price</Text>
              <Input
                placeholder="Sale price (e.g. 85)"
                keyboardType="numeric"
                value={salePrice}
                onChangeText={value => setSalePrice(sanitizeDecimalInput(value))}
                editable={!isTechnician}
                inputStyle={styles.fieldInput}
              />

              <Text style={styles.fieldLabel}>Stock Quantity</Text>
              <Input
                placeholder="Stock quantity"
                keyboardType="numeric"
                value={stockQuantity}
                onChangeText={value => setStockQuantity(sanitizeIntegerInput(value))}
                editable={!isTechnician}
                inputStyle={styles.fieldInput}
              />
            </>
          ) : null}

          <Text style={styles.statusText}>Status: {status}</Text>
          {!!error && <ErrorText text={error} />}
        </Card>
      </KeyboardAwareScrollView>

      <View
        style={[
          styles.actionBar,
          {
            paddingBottom: normalize(10) + insets.bottom,
          },
        ]}>
        <Button
          label={submitting ? 'Saving...' : 'Save as Draft'}
          style={styles.outlineButton}
          labelStyle={styles.outlineButtonText}
          onPress={() => submitProduct('draft')}
          disabled={submitting}
        />
        <Button
          label={submitting ? 'Saving...' : 'Publish'}
          style={styles.primaryButton}
          labelStyle={styles.primaryButtonText}
          onPress={() => submitProduct('published')}
          disabled={submitting}
        />
      </View>
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
  },
  formCard: {
    borderRadius: normalize(18),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(16),
  },
  pageHeading: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.textPrimary,
    marginBottom: normalize(4),
  },
  pageSubHeading: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    marginBottom: normalize(14),
  },
  sectionHeaderRow: {
    marginTop: normalize(4),
    marginBottom: normalize(4),
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    paddingTop: normalize(10),
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.textPrimary,
  },
  fieldLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.textSecondary,
    marginBottom: normalize(4),
    marginTop: normalize(6),
  },
  helperText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    color: COLORS.grey,
    marginBottom: normalize(6),
  },
  fieldInput: {
    marginLeft: 0,
    width: '100%',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: normalize(14),
    paddingVertical: normalize(10),
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  uploadButtonText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
  },
  thumbnailPreview: {
    width: '100%',
    height: normalize(170),
    borderRadius: normalize(12),
    marginBottom: normalize(8),
  },
  clearButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: normalize(12),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(6),
    marginBottom: normalize(8),
  },
  clearButtonText: {
    color: COLORS.red,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  galleryCount: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    marginBottom: normalize(6),
  },
  galleryRow: {
    flexDirection: 'row',
    paddingVertical: normalize(6),
  },
  categoryRow: {
    flexDirection: 'row',
    paddingVertical: normalize(4),
    marginBottom: normalize(6),
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(16),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
    marginRight: normalize(8),
  },
  categoryChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  categoryChipTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  emptyGalleryCard: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderStyle: 'dashed',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(10),
    marginRight: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyGalleryText: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  galleryItem: {
    marginRight: normalize(10),
  },
  galleryPreview: {
    width: normalize(88),
    height: normalize(88),
    borderRadius: normalize(10),
  },
  removeBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(10),
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBadgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.SMALL,
    lineHeight: normalize(14),
  },
  statusText: {
    marginTop: normalize(8),
    marginBottom: normalize(6),
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
  },
  actionBar: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(10),
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: normalize(30),
    marginTop: normalize(6),
  },
  outlineButtonText: {
    color: COLORS.primary,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: normalize(30),
    marginTop: normalize(8),
  },
  primaryButtonText: {
    color: COLORS.lightGrey,
  },
});

export default ManageMyProduct;
