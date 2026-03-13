import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Product} from '../../../models/Product';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';

type MyProductItemProps = {
  item: Product;
  onPress: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onTogglePublish?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  showPublishToggle?: boolean;
  toggling?: boolean;
  deleting?: boolean;
  compact?: boolean;
};

const MyProductItem: React.FC<MyProductItemProps> = ({
  item,
  onPress,
  onEdit,
  onTogglePublish,
  onDelete,
  showPublishToggle = true,
  toggling = false,
  deleting = false,
  compact = false,
}) => {
  const statusText = item.status === 'published' ? 'Published' : 'Draft';
  const statusColor = item.status === 'published' ? '#1B9C5A' : '#A87400';
  const statusBg = item.status === 'published' ? '#E9F8F0' : '#FFF5E1';

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => onPress(item)}
      style={[styles.card, compact ? styles.compactCard : styles.fullCard]}>
      <Image source={item.image as any} style={styles.productImage} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.statusPill, {backgroundColor: statusBg}]}> 
            <Text style={[styles.statusText, {color: statusColor}]}>{statusText}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={compact ? 1 : 2}>
          {item.shortDescription || item.description || 'No description available'}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.originalPrice} numberOfLines={1}>
            {item.price}
          </Text>
          <Text style={styles.salePrice} numberOfLines={1}>
            {item.discountedPrice}
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.offerText}>Offer price</Text>
          <View style={styles.stockPill}>
            <Text style={styles.stockText}>{item.inStock ? 'In Stock' : 'Out of Stock'}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            testID={`my-product-edit-${item.id}`}
            style={styles.actionGhost}
            onPress={() => (onEdit ? onEdit(item) : onPress(item))}>
            <Text style={styles.actionGhostText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID={`my-product-delete-${item.id}`}
            disabled={deleting}
            style={styles.actionDelete}
            onPress={() => onDelete?.(item)}>
            <Text style={styles.actionDeleteText}>{deleting ? 'Deleting...' : 'Delete'}</Text>
          </TouchableOpacity>
          {showPublishToggle ? (
            <TouchableOpacity
              testID={`my-product-toggle-${item.id}`}
              disabled={toggling}
              style={[
                styles.actionPrimary,
                item.status === 'published' ? styles.actionWarning : undefined,
              ]}
              onPress={() => onTogglePublish?.(item)}>
              <Text style={styles.actionPrimaryText}>
                {toggling
                  ? 'Updating...'
                  : item.status === 'published'
                  ? 'Move to Draft'
                  : 'Publish'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: normalize(14),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F1F4',
    elevation: 5,
    shadowColor: '#1D2230',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
    marginBottom: normalize(6),
  },
  compactCard: {
    width: '48.5%',
  },
  fullCard: {
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: normalize(130),
    backgroundColor: '#F8F9FB',
  },
  content: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
    marginRight: normalize(6),
  },
  statusPill: {
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(2),
    borderRadius: normalize(8),
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  description: {
    marginTop: normalize(4),
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(8),
    marginBottom: normalize(6),
  },
  originalPrice: {
    color: '#8A8F9D',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    textDecorationLine: 'line-through',
    marginRight: normalize(6),
  },
  salePrice: {
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
  },
  offerText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  stockPill: {
    paddingHorizontal: normalize(7),
    paddingVertical: normalize(2),
    borderRadius: normalize(10),
    backgroundColor: COLORS.primaryLight,
  },
  stockText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  actionsRow: {
    marginTop: normalize(8),
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: normalize(-3),
    marginBottom: normalize(-3),
  },
  actionGhost: {
    flexGrow: 1,
    minWidth: normalize(88),
    borderWidth: 1,
    borderColor: '#D2D9E5',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    marginHorizontal: normalize(3),
    marginBottom: normalize(6),
    alignItems: 'center',
  },
  actionGhostText: {
    color: '#5A6374',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  actionPrimary: {
    flexGrow: 1,
    minWidth: normalize(120),
    borderRadius: normalize(10),
    backgroundColor: COLORS.primary,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    marginHorizontal: normalize(3),
    marginBottom: normalize(6),
    alignItems: 'center',
  },
  actionWarning: {
    backgroundColor: '#C78A16',
  },
  actionPrimaryText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  actionDelete: {
    flexGrow: 1,
    minWidth: normalize(88),
    borderRadius: normalize(10),
    backgroundColor: '#D24747',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    marginHorizontal: normalize(3),
    marginBottom: normalize(6),
    alignItems: 'center',
  },
  actionDeleteText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
});

export default MyProductItem;
