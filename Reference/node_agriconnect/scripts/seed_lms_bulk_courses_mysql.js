/* eslint-disable no-console */
require('dotenv').config();

const {sequelize, Role, User, Course, Lesson} = require('../src/models');

const assertLocalSafe = () => {
  const host = String(process.env.DB_HOST || '').toLowerCase();
  const dbName = String(process.env.DB_NAME || '').toLowerCase();
  const nodeEnv = String(process.env.NODE_ENV || '').toLowerCase();

  const isLocalHost =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === 'mysql-dev' ||
    host.endsWith('.local');
  const isLocalDbName =
    dbName.includes('dev') || dbName.includes('local') || dbName.includes('test');

  if (!isLocalHost || !isLocalDbName || nodeEnv === 'production') {
    throw new Error(
      `Refusing seed for host=${host || '<empty>'} db=${dbName || '<empty>'} env=${nodeEnv || '<empty>'}`,
    );
  }
};

const imagePool = [
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
];

const baseLessonTopics = [
  'Field Readiness and Risk Mapping',
  'Soil Structure and Organic Matter',
  'Seed Selection and Storage Hygiene',
  'Land Preparation and Bed Layout',
  'Nursery Management Fundamentals',
  'Transplanting and Stand Establishment',
  'Irrigation Scheduling by Growth Stage',
  'Mulching and Moisture Conservation',
  'Nutrient Planning and Split Application',
  'Crop Rotation and Intercropping Basics',
  'Pest Monitoring and Scouting Routine',
  'Disease Prevention and Early Intervention',
  'Weed Management and Labor Planning',
  'Harvest Timing and Quality Control',
  'Post-Harvest Handling and Storage',
  'Packaging Standards and Market Readiness',
  'Farm Recordkeeping and Cost Tracking',
  'Break-Even Analysis and Pricing',
  'Buyer Communication and Negotiation',
  'Climate Adaptation Action Plan',
  'Water Management During Dry Spells',
  'Team Safety, Tools, and SOPs',
  'Season Review and Improvement Loop',
  'Scaling Strategy for Next Season',
  'Community Partnerships and Input Access',
];

const catalog = [
  {
    title: 'Vegetable Farming Mastery',
    subtitle: 'From soil prep to market-ready harvest',
    description:
      'A practical course focused on profitable vegetable production for small and medium farms.',
    duration: '8h 10m',
    lessonCount: 18,
    price: '0',
  },
  {
    title: 'Climate Resilient Crop Planning',
    subtitle: 'Build robust seasonal plans under changing weather',
    description:
      'Learn planning frameworks, crop scheduling, and adaptation strategies for variable climate conditions.',
    duration: '9h 25m',
    lessonCount: 20,
    price: '0',
  },
  {
    title: 'Irrigation and Water Efficiency Blueprint',
    subtitle: 'Reduce water waste while improving yield stability',
    description:
      'A complete playbook for irrigation design, scheduling, and maintenance with field-ready examples.',
    duration: '7h 40m',
    lessonCount: 16,
    price: '0',
  },
  {
    title: 'Farm Business and Market Readiness',
    subtitle: 'Operational discipline for reliable farm income',
    description:
      'Strengthen farm economics, quality standards, and buyer relationships through repeatable systems.',
    duration: '10h 05m',
    lessonCount: 22,
    price: '0',
  },
];

const titleToSlug = value =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const buildLessonContent = ({courseTitle, lessonTitle, lessonNumber, totalLessons}) => {
  return [
    `<h2>${lessonNumber}. ${lessonTitle}</h2>`,
    `<p><strong>Course:</strong> ${courseTitle}</p>`,
    '<p>This lesson translates agronomy principles into clear weekly actions for field teams. It combines planning, observation, and practical execution so farmers can improve consistency and reduce avoidable losses.</p>',
    '<h3>Learning outcomes</h3>',
    '<ul>',
    '<li>Identify the highest-impact activities for this production stage.</li>',
    '<li>Apply a lightweight checklist to maintain quality and timeliness.</li>',
    '<li>Use simple records to compare field performance across weeks.</li>',
    '</ul>',
    '<h3>Field action workflow</h3>',
    '<ol>',
    '<li>Inspect the plot and document visible risks in the morning.</li>',
    '<li>Prioritize interventions by urgency, labor availability, and cost.</li>',
    '<li>Execute actions in blocks and verify outcomes before closing the day.</li>',
    '</ol>',
    '<blockquote>Consistency beats intensity: small daily corrections prevent large seasonal failures.</blockquote>',
    '<h3>Quick reference table</h3>',
    '<table border="1" cellpadding="6" cellspacing="0">',
    '<thead><tr><th>Checkpoint</th><th>Target</th><th>Frequency</th></tr></thead>',
    '<tbody>',
    '<tr><td>Moisture status</td><td>Within crop range</td><td>Daily</td></tr>',
    '<tr><td>Plant vigor</td><td>No sudden decline</td><td>Twice weekly</td></tr>',
    '<tr><td>Input log</td><td>Updated and complete</td><td>After each task</td></tr>',
    '</tbody>',
    '</table>',
    `<p><em>Progress marker:</em> Lesson ${lessonNumber} of ${totalLessons}. Review this page before your next field visit.</p>`,
  ].join('');
};

const run = async () => {
  assertLocalSafe();
  await sequelize.authenticate();

  const farmerRole = await Role.findOne({where: {name: 'farmer'}});
  if (!farmerRole) {
    throw new Error('Farmer role not found. Run base domain seed first.');
  }

  let instructor = await User.findOne({where: {email: 'demo-farmer@agriconnect.local'}});
  if (!instructor) {
    instructor = User.build({
      name: 'Demo Farmer',
      email: 'demo-farmer@agriconnect.local',
      phone: '0777000001',
      role_id: farmerRole.id,
      country_code: '+231',
      info: {},
    });
    await instructor.setPassword('AgriConnect@123');
    await instructor.save();
  }

  const report = [];

  for (let courseIndex = 0; courseIndex < catalog.length; courseIndex += 1) {
    const courseSeed = catalog[courseIndex];
    const mainImage = imagePool[courseIndex % imagePool.length];

    const [course, courseCreated] = await Course.findOrCreate({
      where: {
        title: courseSeed.title,
        instructor_id: instructor.id,
      },
      defaults: {
        title: courseSeed.title,
        subtitle: courseSeed.subtitle,
        description: courseSeed.description,
        price: courseSeed.price,
        duration: courseSeed.duration,
        instructor_id: instructor.id,
        course_preview: mainImage,
        thumbnail_image: mainImage,
      },
    });

    if (!courseCreated) {
      await course.update({
        subtitle: courseSeed.subtitle,
        description: courseSeed.description,
        price: courseSeed.price,
        duration: courseSeed.duration,
        course_preview: mainImage,
        thumbnail_image: mainImage,
      });
    }

    let createdLessons = 0;
    let updatedLessons = 0;

    for (let i = 0; i < courseSeed.lessonCount; i += 1) {
      const lessonNumber = i + 1;
      const topic = baseLessonTopics[i % baseLessonTopics.length];
      const lessonTitle = `${topic} (${lessonNumber})`;
      const lessonImage = imagePool[(courseIndex + i + 1) % imagePool.length];
      const lessonSlug = titleToSlug(lessonTitle);

      const lessonPayload = {
        title: lessonTitle,
        content: buildLessonContent({
          courseTitle: courseSeed.title,
          lessonTitle,
          lessonNumber,
          totalLessons: courseSeed.lessonCount,
        }),
        resource_url: `https://agriconnect.local/resources/${titleToSlug(courseSeed.title)}/${lessonSlug}`,
        course_id: course.id,
        lesson_asset: lessonImage,
        thumbnail_asset: lessonImage,
      };

      const [lesson, lessonCreated] = await Lesson.findOrCreate({
        where: {
          course_id: course.id,
          title: lessonTitle,
        },
        defaults: lessonPayload,
      });

      if (lessonCreated) {
        createdLessons += 1;
      } else {
        await lesson.update(lessonPayload);
        updatedLessons += 1;
      }
    }

    report.push({
      courseId: Number(course.id),
      title: course.title,
      lessonCount: courseSeed.lessonCount,
      courseCreated,
      createdLessons,
      updatedLessons,
      thumbnail: course.thumbnail_image,
    });
  }

  console.log(JSON.stringify({seededCourses: report.length, courses: report}, null, 2));
  await sequelize.close();
};

run().catch(async error => {
  console.error('seed-lms-bulk-error', error?.message || error);
  try {
    await sequelize.close();
  } catch (_error) {
    // ignore close errors in failure path
  }
  process.exit(1);
});
