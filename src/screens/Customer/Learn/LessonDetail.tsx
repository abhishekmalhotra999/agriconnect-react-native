import {ScrollView, StyleSheet, Text, View} from 'react-native';
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
  const completeLearnState = useAppSelector(state => state.learn);
  const dispatch = useAppDispatch();

  const lessonId = params.id;
  const courseId = params.courseId;

  const isLessonCompleted = useMemo(() => {
    return completedLessons?.find(leson => leson.lesson_id === lessonId);
  }, [lessonId, completedLessons]);

  const lessonDetail = useMemo(() => {
    return lessons.find((lesson: Lesson) => lesson.id == lessonId);
  }, [lessons, lessonId]);

  console.log('printing complete state', completeLearnState, lessonId);

  const completeLessonHandler = async () => {
    setLoading(true);
    const result = await updateLessonProgress(lessonDetail!.id);
    console.log(result);
    dispatch(learnActions.addCompletedLesson(result));
    dispatch(learnActions.incrementLessonProgress({courseId}));
    setLoading(false);
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
        <RenderHtml
          source={{html: lessonDetail?.content}}
          baseStyle={styles.htmlStyle}
          tagsStyles={tagsStyles}
        />
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
