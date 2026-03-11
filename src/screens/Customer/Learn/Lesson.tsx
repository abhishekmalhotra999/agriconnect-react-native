import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import Header from '../../../containers/header';
// import {ScrollView} from 'react-native-gesture-handler';
import Accordion from 'react-native-collapsible/Accordion';
import {useEffect, useMemo, useState} from 'react';
import {COLORS} from '../../../themes/styles';
import {useAppDispatch, useAppSelector} from '../../../store/storage';
import {getLesson, getLessonCompletionProgress} from '../../../api/learn.api';
import learnAction from '../../../store/slices/learn.slice';
import RenderHtml from 'react-native-render-html';
import {normalize} from '../../../utils/util';
import {greenCheck, listItem2} from '../../../constants/images';

export default function Lesson({route, navigation}) {
  const [loading, setLoading] = useState(true);
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const {id} = route.params;
  const authToken = useAppSelector(state => state.auth.authToken);
  const dispatch = useAppDispatch();
  const {width} = useWindowDimensions();
  const {lessons, courses, completedLessons} = useAppSelector(
    state => state.learn,
  );

  const courseDetail = useMemo(() => {
    return courses.find(course => course.id === id);
  }, [courses, id]);

  const courseHeroSource = useMemo(() => {
    if (!heroImageFailed && courseDetail?.thumbnailUrl) {
      return {uri: courseDetail.thumbnailUrl};
    }

    return listItem2;
  }, [courseDetail?.thumbnailUrl, heroImageFailed]);

  useEffect(() => {
    if (id && authToken) {
      getLesson(id, authToken)
        .then(result => {
          setLoading(false);
          dispatch(learnAction.saveAllLessons(result));
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });

      getLessonCompletionProgress(id)
        .then(result => {
          setLoading(false);
          dispatch(learnAction.saveCompletedLessons(result));
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    }
  }, [id, authToken]);
  const sectionChangeHandler = async (section: number[]) => {
    setActiveSections(section);
  };

  const renderContent = (section, _, isActive) => {
    //   const navigation = useNavigation();
    const handlePress = () => {
      console.log('open detail view for this lesson', section);
      navigation.navigate('LessonDetail', {
        id: section.id,
        courseId: id,
      });
    };
    return (
      <View style={styles.accordBody}>
        {/* <RenderHtml
        source={{html: section.content}}
        baseStyle
      /> */}
        <TouchableOpacity onPress={handlePress}>
          <Text
            style={styles.contentStyle}
            numberOfLines={3}
            ellipsizeMode="tail">
            {section.contentPlain}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderHeader = (section, index: number, isActive: boolean) => {
    const isCompleted = () => {
      return !!completedLessons.find(
        cl => String(cl.lesson_id) === String(section.id),
      );
    };
    return (
      <View style={styles.accordHeader}>
        {/* <View> */}
        <View style={styles.headerPrimary}>
          <View style={styles.containerCount}>
            <Text style={styles.idText}>{index + 1}</Text>
          </View>
          {/* </View> */}
          <Text style={styles.accordTitle}>{section.title}</Text>
        </View>
        {isCompleted() && (
          <View style={styles.checkContainer}>
            <Image source={greenCheck} style={styles.checkImage} />
          </View>
        )}
        {/* <Icon
        name={isActive ? 'chevron-up' : 'chevron-down'}
        size={20}
        color="#bbb"
      /> */}
      </View>
    );
  };
  return (
    <View style={styles.wrapper}>
      <Header
        title={courseDetail?.title}
        goBack
        numberOfLines={1}
        ellipsizeMode="tail"
        width={210}
      />
      {loading && <ActivityIndicator />}
      {!loading && (
        <ScrollView style={styles.scrollContainer}>
          <Image
            source={courseHeroSource}
            style={styles.image}
            resizeMode="cover"
            onError={() => setHeroImageFailed(true)}
          />
          <View>
            {courseDetail?.description ? (
              <RenderHtml
                source={{html: courseDetail.description}}
                baseStyle={styles.descriptionText}
                contentWidth={width}
              />
            ) : null}
            <Accordion
              sections={lessons}
              activeSections={activeSections}
              renderHeader={renderHeader}
              renderContent={renderContent}
              onChange={sectionChangeHandler}
              sectionContainerStyle={styles.accordContainer}
              underlayColor={COLORS.lightGrey}
            />
            {/* <FlatList
            data={DATA}
            keyExtractor={item => item.id}
            renderItem={AccordianItem}
          /> */}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: normalize(100),
  },
  image: {
    width: Dimensions.get('window').width,
    height: 220,
  },
  accordContainer: {
    paddingBottom: 6,
    borderRadius: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: COLORS.white,
  },
  containerCount: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  idText: {},
  contentStyle: {
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 12,
    color: COLORS.grey,
    lineHeight: 20,
  },
  accordHeader: {
    padding: 12,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },
  headerPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordTitle: {
    fontSize: 15,
    color: COLORS.black,
    maxWidth: '84%',
  },
  accordBody: {
    padding: 12,
  },
  descriptionText: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    color: COLORS.grey,
  },
  checkContainer: {},
  checkImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
