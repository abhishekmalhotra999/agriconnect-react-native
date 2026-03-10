import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../../containers/header';
import {
  chevronDown,
  chevronUp,
  mailColorIcon,
  userColorIcon,
} from '../../../constants/images';
import {COLORS} from '../../../themes/styles';
import Accordion from 'react-native-collapsible/Accordion';
import {useState} from 'react';

const data = [
  {
    title: 'What is AgriConnect and how can it help me?',
    body: 'AgriConnect is a mobile and web-based platform designed to empower smallholder farmers by providing access to free agricultural learning materials, market trends, and a marketplace to connect with buyers and suppliers.',
  },
  {
    title: 'How do I create an account in AgriConnect?',
    body: 'You can sign upusing your phone number or email, Simply follow the on-screen instructions, enter your details, and verify your account to start using the platform.',
  },
  {
    title: 'How can i access the learning materials?',
    body: 'The Learning Portal contains video tutorials, articlesm and infographics on modern farming techniques. You can access it from the home screen and browse topics based on your interests.',
  },
  {
    title: 'How does the marketplace work?',
    body: 'Farmers can list their products for sale, while buyers can browse and contact sellers directly. Transactions can be arranged through the platform for secure trade.',
  },
  {
    title: 'Can i communicate with other farmers or buyers?',
    body: 'Yes! The app includes a messaging feature that allows farmers, buyers and exters to connect, ask questions, and negotiate deals',
  },
  {
    title: 'Is AgriConnect free to use',
    body: 'Yes, the learning materials and marketplace access are completely free.',
  },
  {
    title: 'How do i get support is i face issues?',
    body: 'You can visit the Help Center section inthe app for FAQs, guides, or contact customer support for assistance.',
  },
];

export default function HelpCenter() {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const sectionChangeHandler = async (section: number[]) => {
    setActiveSections(section);
  };
  const renderContent = (section, _, isActive) => {
    //   const navigation = useNavigation();
    return (
      <View style={styles.accordBody}>
        {/* <RenderHtml
        source={{html: section.content}}
        baseStyle
      /> */}
        <View>
          <Text
            style={styles.contentStyle}
            // numberOfLines={3}
            // ellipsizeMode="tail"
          >
            {section.body}
          </Text>
        </View>
      </View>
    );
  };
  const renderHeader = (section, index: number, isActive: boolean) => {
    return (
      <View style={styles.accordHeader}>
        {/* <View> */}
        <View style={styles.headerPrimary}>
          {/* </View> */}
          <Text style={styles.accordTitle}>{section.title}</Text>
        </View>
        <View>
          {isActive ? (
            <Image source={chevronUp} style={styles.iconImage} />
          ) : (
            <Image source={chevronDown} style={styles.iconImage} />
          )}
          {/* <Image source={chevronUp} style={styles.iconImage} /> */}
        </View>
        {/* <Icon
          name={isActive ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#bbb"
        /> */}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Header goBack title="Help Center" icons={false} />
      <ScrollView style={styles.scrollContainer}>
        <View>
          <View style={styles.cardContainer}>
            <View>
              <Image source={userColorIcon} style={styles.iconImage} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>Our 24x7 Customer Service</Text>
              <Text style={styles.cardText}>+91 8484-XXXXX</Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View>
              <Image source={mailColorIcon} style={styles.iconImage} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>Write us at</Text>
              <Text style={styles.cardText}>support@XXXXX.com</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardContainer}>
          <Accordion
            sections={data}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={sectionChangeHandler}
            sectionContainerStyle={styles.accordContainer}
            underlayColor={COLORS.lightGrey}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 5,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginVertical: 10,
  },
  iconImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  cardContent: {
    marginLeft: 15,
  },
  cardText: {
    color: COLORS.grey,
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  accordContainer: {
    paddingBottom: 4,
  },
  accordHeader: {
    padding: 12,
    // backgroundColor: '#666',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },
  accordTitle: {
    fontSize: 14,
    color: COLORS.grey,
  },
  accordBody: {
    paddingHorizontal: 12,
  },
  headerPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    // backgroundColor: 'lime',
  },
  contentStyle: {
    // backgroundColor: COLORS.lightGrey,
    // padding: 10,
    // borderRadius: 10,
    color: COLORS.grey,
  },
});
