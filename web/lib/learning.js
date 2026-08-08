/** Active-learning checkpoints derived from real curriculum metadata. */
const catalog = require('./catalog');
const store = require('./store');

const MISCONCEPTIONS = {
  array: 'An array resize is not free: copying makes the resize operation linear even when appends are amortized.',
  'linked-list': 'Linked lists do not provide constant-time indexed access; finding a position still requires traversal.',
  stack: 'A stack constrains access order; it does not automatically make an algorithm recursive.',
  queue: 'Queue order is FIFO, while a priority queue removes by priority rather than insertion order.',
  tree: 'Tree depth and node count are different measures; a balanced tree is not necessarily complete.',
  graph: 'Marking visited too late can enqueue or recurse into the same graph node many times.',
  sorting: 'A stable sort preserves the order of equal keys; stability does not mean in-place operation.',
  recursion: 'Every recursive solution needs both a terminating base case and progress toward it.'
};

function uniqueChoices(answer, alternatives) {
  return [answer, ...alternatives].filter((value, index, all) => value && all.indexOf(value) === index).slice(0, 4);
}

function lessonActivities(lessonId) {
  const lesson = catalog.getLesson(lessonId);
  if (!lesson) return null;
  const chapter = catalog.getChapterDetail(lesson.chapterId);
  const topics = chapter.topics || [];
  const signatures = lesson.api || [];
  const checkpoints = [];

  if (signatures.length) {
    const answer = signatures[0];
    checkpoints.push({
      id: 'api-retrieval',
      kind: 'retrieval',
      prompt: 'Without looking back at the code, which method is implemented in this lesson?',
      choices: uniqueChoices(answer, ['void reset()', 'String serialize()', 'boolean isEmpty()']),
      answerIndex: 0,
      explanation: `The lesson exposes ${answer}. Recalling the actual API is stronger evidence than rereading it.`
    });
  }

  const concept = (lesson.bullets || [])[0] || lesson.summary;
  if (concept) {
    checkpoints.push({
      id: 'concept-retrieval',
      kind: 'retrieval',
      prompt: 'Which idea is explicitly taught by this lesson?',
      choices: uniqueChoices(concept, [
        'Every operation shown is constant time.',
        'The data structure never uses additional memory.',
        'The implementation works without considering edge cases.'
      ]),
      answerIndex: 0,
      explanation: `The lesson states: ${concept}`
    });
  }

  const completed = store.getProgress().lessons;
  const prerequisites = (chapter.prerequisites || []).map((id) => {
    const prerequisite = catalog.getChapterDetail(id);
    const lessons = (prerequisite && prerequisite.lessons) || [];
    const done = lessons.filter((row) => (completed[row.id] || {}).status === 'completed').length;
    return {
      id,
      title: prerequisite ? prerequisite.title : id,
      complete: lessons.length > 0 && done === lessons.length,
      progress: { done, total: lessons.length }
    };
  });

  return {
    lessonId,
    topics,
    prerequisites,
    misconceptions: topics.map((slug) => MISCONCEPTIONS[slug]).filter(Boolean).slice(0, 3),
    checkpoints,
    reflectionPrompt: 'What would you explain differently if you had to teach this lesson tomorrow?',
    progress: store.lessonLearning(lessonId)
  };
}

function publicActivities(activities) {
  if (!activities) return null;
  return {
    ...activities,
    checkpoints: activities.checkpoints.map(({ answerIndex, explanation, ...checkpoint }) => checkpoint)
  };
}

function answerCheckpoint(lessonId, checkpointId, answerIndex) {
  const activities = lessonActivities(lessonId);
  if (!activities) return null;
  const checkpoint = activities.checkpoints.find((row) => row.id === checkpointId);
  if (!checkpoint) return null;
  const selected = Number(answerIndex);
  const correct = Number.isInteger(selected) && selected === checkpoint.answerIndex;
  const progress = store.recordCheckpoint(lessonId, checkpointId, {
    correct,
    answerIndex: selected,
    topics: activities.topics
  });
  return { correct, explanation: checkpoint.explanation, progress };
}

function saveReflection(lessonId, text) {
  const activities = lessonActivities(lessonId);
  if (!activities) return null;
  return store.saveReflection(lessonId, text, activities.topics);
}

module.exports = { lessonActivities, publicActivities, answerCheckpoint, saveReflection };