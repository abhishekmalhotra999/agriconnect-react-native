import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import { outerCircle, groupCenter, groupLeft, groupRight } from '../../../constants/images';

const GroupSession: React.FC = () => {
  return (
    <View style={styles.groupSessions}>
      <View style={styles.column}>
        <Text style={styles.groupSessionsTitle}>Group Sessions</Text>
        <Text style={styles.groupSessionsSubtitle}>Off-line exchange of learning experiences</Text>
      </View>
      <ImageBackground source={outerCircle} style={styles.groupImageMainContainer}>
        <Image source={groupCenter} style={[styles.groupImage, styles.centerImage]} />
        <View style={styles.groupImageContainer}>
          <Image source={groupLeft} style={styles.groupImage} />
          <Image source={groupRight} style={styles.groupImage} />
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  groupSessions: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.cyan,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  groupSessionsTitle: {
    fontSize: FONT_SIZES.MLARGE,
    fontFamily: FONTS.medium,
    color: COLORS.purple,
  },
  groupSessionsSubtitle: {
    fontSize: FONT_SIZES.XSMALL,
    fontFamily: FONTS.regular,
    color: COLORS.purple,
  },
  groupImageMainContainer: {
    alignItems: 'center',
    justifyContent: 'center', 
    padding: 10, 
    height: 95,
  },
  groupImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(-20),
  },
  groupImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  centerImage: {
    position: 'relative',
    left: 0,
    top: 0,
    zIndex: 1,
  }
})

export default GroupSession;