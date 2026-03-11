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
        {lessonDetail?.thumbnailUrl ? (
          <Image
            source={{uri: lessonDetail.thumbnailUrl}}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : null}

        {lessonDetail?.asset?.contentType === 'image' && lessonDetail?.asset?.url ? (
          <Image
            source={{uri: lessonDetail.asset.url}}
            style={styles.assetImage}
            resizeMode="cover"
          />
        ) : null}
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
    // paddingBottom: 60,
    // paddingTop: 10,
  },
  content: {
    // padding: 20,
    paddingHorizontal: 20,
    // paddingBottom: 60,
    // paddingBottom: normalize(150),
    flexGrow: 1,
  },
  htmlStyle: {
    fontSize: 16,
    // color: COLORS.grey,
    paddingVertical: 10,
  },
  emptyText: {
    color: COLORS.grey,
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 10,
  },
  thumbnail: {
    width: '100%',
    height: normalize(180),
    borderRadius: normalize(10),
    marginBottom: normalize(10),
  },
  assetImage: {
    width: '100%',
    height: normalize(190),
    borderRadius: normalize(10),
    marginBottom: normalize(12),
  },
  control: {
    paddingVertical: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.orange,
    paddingVertical: 6,
    borderRadius: 4,
    paddingHorizontal: 5,
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
