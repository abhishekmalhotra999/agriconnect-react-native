import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Header from '../../../containers/header';
import {useAppDispatch, useAppSelector} from '../../../store/storage';
import {useMemo, useState} from 'react';
import {Lesson} from '../../../models/Course';
import RenderHtml from 'react-native-render-html';
import {normalize} from '../../../utils/util';
import {COLORS} from '../../../themes/styles';
import Button from '../../../components/UI/Button';
import {updateLessonProgress} from '../../../api/learn.api';
import learnActions from '../../../store/slices/learn.slice';
import {listItem3} from '../../../constants/images';

const tagsStyles = {
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
};

export default function LessonDetail({route}) {
  const params = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const {lessons, completedLessons} = useAppSelector(state => state.learn);
  const dispatch = useAppDispatch();
  const {width} = useWindowDimensions();

  const lessonId = params.id;
  const courseId = params.courseId;

  const isLessonCompleted = useMemo(() => {
    return completedLessons?.find(
      leson => String(leson.lesson_id) === String(lessonId),
    );
  }, [lessonId, completedLessons]);

  const lessonDetail = useMemo(() => {
    return lessons.find((lesson: Lesson) => lesson.id == lessonId);
  }, [lessons, lessonId]);

  const heroSource = useMemo(() => {
    if (lessonDetail?.thumbnailUrl) {
      return {uri: lessonDetail.thumbnailUrl};
    }

    if (lessonDetail?.asset?.contentType === 'image' && lessonDetail?.asset?.url) {
      return {uri: lessonDetail.asset.url};
    }

    return listItem3;
  }, [lessonDetail]);

  const lessonHtml = useMemo(() => {
    const rawContent =
      lessonDetail?.content ||
      (lessonDetail as any)?.content_html ||
      (lessonDetail as any)?.description ||
      '';

    const textFallback =
      lessonDetail?.contentPlain || (lessonDetail as any)?.content_plain || '';

    if (String(rawContent).trim()) {
      return String(rawContent);
    }

    if (String(textFallback).trim()) {
      return `<p>${String(textFallback)}</p>`;
    }

    return '';
  }, [lessonDetail]);

  const completeLessonHandler = async () => {
    if (!lessonDetail?.id) {
      return;
    }

    setLoading(true);
    try {
      const result = await updateLessonProgress(lessonDetail.id);
      if (result) {
        dispatch(learnActions.addCompletedLesson(result));
        dispatch(learnActions.incrementLessonProgress({courseId}));
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.wrapper}>
      <Header title={lessonDetail?.title} goBack icons={false} />
      <ScrollView style={styles.content}>
        <Image source={heroSource} style={styles.heroImage} resizeMode="cover" />

        <View style={styles.control}>
          <Text style={styles.instructorText}>Instructor: {'admin'}</Text>
          <Button
            label={
              loading
                ? 'Loading...'
                : isLessonCompleted
                ? 'Completed'
                : 'Mark as Completed'
            }
            style={styles.button}
            labelStyle={styles.buttonLabelStyle}
            onPress={completeLessonHandler}
            disabled={loading || !!isLessonCompleted}
          />
        </View>
        {lessonHtml ? (
          <RenderHtml
            source={{html: lessonHtml}}
            baseStyle={styles.htmlStyle}
            tagsStyles={tagsStyles}
            contentWidth={width}
          />
        ) : (
          <Text style={styles.emptyText}>
            No lesson content available for this lesson yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  heroImage: {
    width: '100%',
    height: normalize(200),
    borderRadius: normalize(14),
    marginTop: normalize(12),
    marginBottom: normalize(10),
    backgroundColor: COLORS.lightGrey,
  },
  htmlStyle: {
    fontSize: 16,
    paddingVertical: 10,
    lineHeight: 24,
    color: COLORS.black,
  },
  emptyText: {
    color: COLORS.grey,
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 10,
  },
  control: {
    paddingVertical: 14,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  button: {
    backgroundColor: COLORS.orange,
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  buttonLabelStyle: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  instructorText: {
    color: COLORS.grey,
  },
});
