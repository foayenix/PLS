import course from './course.json';

type Lesson = { id: string; title: string };
type Resource = { title: string; url: string };
export type TutorPlan = {
  title: string;
  concept: string;
  exercise: string;
  hint: string;
  check: string;
  criteria: string[];
  lessons: Lesson[];
  sources: Resource[];
  project?: string;
  origin: 'curated' | 'catalog' | 'independent' | 'model';
};
export type TutorProgress = {
  question: string;
  plan: TutorPlan;
  step: number;
  prediction?: string;
  evidence?: string;
  recall?: string;
  verified?: boolean;
};

const nav = { title: 'Nav2 Gazebo setup guide', url: 'https://docs.nav2.org/jazzy/configuration_and_development/first_time_robot_setup_guide/gazebo/' };
const startNav = { title: 'Nav2 simulation quickstart', url: 'https://docs.nav2.org/jazzy/getting_started/' };
const odom = { title: 'Modern Robotics · Wheeled robot odometry', url: 'https://modernrobotics.northwestern.edu/nu-gm-book-resource/13-4-odometry/' };
const ros = { title: 'ROS 2 Jazzy tutorials', url: 'https://docs.ros.org/en/jazzy/Tutorials.html' };
const bag = { title: 'ROS 2 · Recording and playing back data', url: 'https://docs.ros.org/en/jazzy/Tutorials/Beginner-CLI-Tools/Recording-And-Playing-Back-Data/Recording-And-Playing-Back-Data.html' };
const april = { title: 'AprilTag ROS 2 package', url: 'https://github.com/christianrauch/apriltag_ros' };

type Template = Omit<TutorPlan, 'lessons' | 'origin' | 'sources'> & {
  id: string; terms: string[]; lessonIds?: string[]; sources?: Resource[];
};

const templates: Template[] = [
  { id: 'ros2-topics', title: 'Connect two ROS 2 nodes', terms: ['ros 2', 'ros2', 'publisher', 'subscriber', 'topics', 'rclcpp', 'qos'], project: 'ros2-diagnostics', sources: [ros, startNav],
    concept: 'A publisher sends typed messages on a topic. A subscriber receives them when the topic, message type and requested quality of service are compatible.',
    exercise: 'Run a ROS 2 talker and listener. Find the topic and its type in the terminal. Stop the talker, observe the change, then restart it. Add one edit to the talker and predict what the listener will print.',
    hint: 'Inspect the graph first. Compare the topic name, message type and endpoint details before changing code.',
    check: 'Two nodes are active but the listener shows no messages. What three pieces of evidence would you collect before editing the nodes?',
    criteria: ['Name the topic and message type on both endpoints.', 'Check the publishing rate and the requested/offered QoS.', 'Explain what changed after stopping or restarting the publisher.'] },
  { id: 'odometry-watchdog', title: 'Catch stale odometry in C++', terms: ['stale odometry', 'watchdog', 'odometry stops', 'rosbag', 'ros bag', 'stale sensor', 'diagnostics', 'timeout', 'replay'], project: 'ros2-diagnostics', sources: [bag, odom, ros],
    concept: 'Odometry estimates robot motion over time. A watchdog observes when valid samples arrive and tracks changes between waiting, healthy and stale.',
    exercise: 'Sketch a C++ health function that takes a time and an optional last arrival. Predict results for startup, regular messages, a gap at the timeout boundary and recovery. Drive the rule with synthetic events, then replay a recorded topic.',
    hint: 'Keep the clock and health rule independent of the ROS subscriber. Write down what happens at the exact boundary and during a simulator pause.',
    check: 'A paused simulation and an unplugged sensor both produce silence. How could your test distinguish the two, and what should recovery look like?',
    criteria: ['Name the clock and explain the behaviour when it pauses or jumps.', 'Show tests for startup, the timeout boundary and recovery.', 'Use an observable transition so the check can be replayed.'] },
  { id: 'transforms', title: 'Trace a reading across robot frames', terms: ['tf2', 'coordinate frame', 'transform', 'base link', 'base_link', 'odom frame', 'map frame', 'wheel odometry', 'pose drift'], project: 'indoor-delivery-rover', sources: [nav, odom],
    concept: 'Transforms relate poses and readings in different coordinate frames. Navigation needs a consistent path between map, odom, the robot base and the sensor frames at the relevant timestamp.',
    exercise: 'Draw the frame tree for a differential-drive rover with LiDAR. Predict which frames move when the robot turns. Inspect your simulation frame tree and compare a scan or pose after a known turn.',
    hint: 'Work from a single reading. Identify the frame in which it was measured and the timestamp at which it must be transformed.',
    check: 'The LiDAR data is visible in its own frame but disappears when you switch to the map frame. What would you inspect first?',
    criteria: ['Explain the roles of map, odom and base frames.', 'Identify where the transform chain or timestamp can break.', 'Use a controlled movement to validate frame axes.'] },
  { id: 'navigation', title: 'Map, localise and send a navigation goal', terms: ['nav2', 'slam', 'localisation', 'localization', 'costmap', 'path planning', 'waypoint', 'navigate', 'navigation', 'gazebo'], project: 'indoor-delivery-rover', sources: [startNav, nav],
    concept: 'Mapping estimates a map and pose. Localisation estimates pose against a known map. A planner selects a route and a controller turns it into motion commands.',
    exercise: 'Start the Nav2 demo and complete a short waypoint run. Repeat after selecting a different reachable goal or blocking the path in simulation. Compare the planned route, robot motion and final result.',
    hint: 'Check the initial pose, current costmap and planned path separately. Change one variable between runs.',
    check: 'A path appears in RViz but the rover oscillates at a doorway. Which evidence would help you distinguish a pose problem from a controller or footprint problem?',
    criteria: ['Explain which component creates a map, estimates pose, plans and controls motion.', 'Record a normal run and a failure or recovery with their outcomes.', 'Point to data that supports the next debugging step.'] },
  { id: 'docking', title: 'Use a camera marker to guide docking', terms: ['docking', 'apriltag', 'april tag', 'marker pose', 'camera calibration', 'perception'], project: 'camera-guided-docking', sources: [april, nav],
    concept: 'A calibrated camera estimates a marker pose in its own frame. A docking controller needs a fresh pose expressed in the rover’s frame to make a bounded approach.',
    exercise: 'In simulation, compare detections at two starting angles. Observe the marker pose, then hide the marker while approaching. Record position error, heading error and whether the rover stopped.',
    hint: 'Validate the transform with the rover stationary before tuning the approach. Separate marker visibility from control performance.',
    check: 'The rover docks head-on but misses from 30 degrees. How would you test whether the measurements or the controller caused the change?',
    criteria: ['Check pose timestamps and axes with a controlled reference.', 'Describe a clear stop condition for missing or stale data.', 'Measure position and heading separately across multiple runs.'] },
  { id: 'hardware', title: 'Compare a simulated waypoint with hardware', terms: ['physical robot', 'hardware', 'sim to real', 'sim2real', 'wheel slip', 'field failure'], project: 'indoor-delivery-rover', sources: [nav, odom],
    concept: 'A physical run introduces variation in sensors, timing, traction and calibration. A repeatable baseline helps you connect unexpected motion to measured inputs and software state.',
    exercise: 'Write a supervised test plan for a single waypoint at low speed in a controlled space. Define a stop procedure, what data to record and how to compare it with a simulation run. Rehearse the run in simulation first.',
    hint: 'Record the starting pose, environment, software configuration and sensor timestamps so you can compare like with like.',
    check: 'Simulation reaches the goal consistently, while the real rover drifts on the turn. How would you isolate one likely cause with a small test?',
    criteria: ['Give a clear stop procedure and supervised test boundary.', 'Compare the same measurable outcome in simulation and on hardware.', 'Control one variable at a time and label the limits of your evidence.'] },
  { id: 'rag-evaluation', title: 'Evaluate retrieval and answers separately', terms: ['rag', 'retrieval', 'citation', 'vector search', 'retrieval augmented generation', 'grounding', 'embedding'], project: 'retrieval',
    lessonIds: ['phases/11-llm-engineering/10-evaluation', 'phases/11-llm-engineering/04-embeddings'],
    concept: 'Retrieval quality asks whether the right evidence appears. Answer quality asks whether the response uses the evidence correctly and knows when to abstain.',
    exercise: 'Write five questions over a small document set, including one unanswerable question. Mark the source passages before running retrieval. Compare a baseline and a change on those same questions.',
    hint: 'Trace a failed example through source selection first, then through answer generation.',
    check: 'Retrieval recall improves, but more answers cite the wrong policy. Which intermediate outputs should you examine and what would count as a fix?',
    criteria: ['Define relevant evidence before running the system.', 'Keep retrieval and answer metrics separate.', 'Include an unanswerable case and report at least one per-question result.'] },
  { id: 'agent-tools', title: 'Give an AI workflow a bounded tool', terms: ['agent', 'tool calling', 'function calling', 'structured output', 'json schema', 'human review', 'mcp'], project: 'payment-exceptions',
    lessonIds: ['phases/11-llm-engineering/09-function-calling', 'phases/11-llm-engineering/03-structured-outputs'],
    concept: 'The model proposes a tool call. Application code validates inputs and decides which operation is appropriate before executing it.',
    exercise: 'Create a mock read-only lookup over synthetic records. Test a valid request, an unknown record and a missing argument. Specify how the workflow signals missing evidence to a reviewer.',
    hint: 'Write the expected input and output for each fixture before connecting a model.',
    check: 'The tool returns no records in one run and times out in another. How can the caller distinguish the outcomes and decide what to show?',
    criteria: ['State and validate the tool’s input contract.', 'Keep a failed lookup distinct from zero results.', 'Use a fixture to prove what the reviewer will see.'] },
  { id: 'automation', title: 'Handle duplicated workflow events', terms: ['webhook', 'idempotency', 'duplicate', 'automation', 'retry', 'event'], project: 'invoice-mismatch',
    lessonIds: ['phases/11-llm-engineering/10-evaluation'],
    concept: 'Repeated deliveries can represent the same logical event. A stable identity and a durable uniqueness rule let retries share an effect.',
    exercise: 'Create a synthetic event, deliver it twice and assert that it produces one record. Add a failed write and decide which result a retry should return.',
    hint: 'Think through what happens when a retry arrives while the first delivery is still being processed.',
    check: 'Two workers receive the same event at the same time. What guarantees a single durable action and how would you demonstrate it?',
    criteria: ['Explain what makes the event ID stable.', 'Enforce uniqueness where the record is persisted.', 'Test repeated delivery and recovery from failure.'] },
];

const stop = new Set('a an and are be build can could do does for from get help how i in is it learn me my of on or please should show so that the this to use want what when where which why with would you your'.split(' '));
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const words = (value: string) => new Set(normalize(value).split(' ').filter(word => word.length > 1 && !stop.has(word)));

function findLessons(question: string) {
  const query = words(question);
  return course.catalog.flatMap(lesson => {
    const title = words(lesson.title);
    const matches = [...query].filter(word => title.has(word)).length;
    if (!matches || (matches === 1 && query.size > 1 && ![...query].some(word => word.length >= 5 && title.has(word)))) return [];
    return [{ id: lesson.id, title: lesson.title, score: 3 * matches - title.size / 10 }];
  }).sort((a, b) => b.score - a.score).slice(0, 3).map(({ id, title }) => ({ id, title }));
}

export function templatePlan(id: string): TutorPlan | undefined {
  const template = templates.find(item => item.id === id);
  if (!template) return;
  const { terms: _terms, id: _id, lessonIds, sources, ...plan } = template;
  const lessons = (lessonIds ?? []).flatMap(id => {
    const lesson = course.catalog.find(item => item.id === id);
    return lesson ? [{ id, title: lesson.title }] : [];
  });
  return { ...plan, origin: 'curated', lessons, sources: sources ?? [] };
}

export function planQuestion(question: string): TutorPlan {
  const query = ' ' + normalize(question) + ' ';
  const ranked = templates.map(template => ({
    id: template.id,
    score: template.terms.reduce((sum, term) => {
      const phrase = normalize(term);
      if (!query.includes(' ' + phrase + ' ')) return sum;
      if (phrase === 'ros 2' || phrase === 'ros2') return sum + 1;
      return sum + (phrase.includes(' ') ? 5 : 2);
    }, 0),
  })).sort((a, b) => b.score - a.score);
  if (ranked[0].score > 0) {
    const plan = templatePlan(ranked[0].id);
    if (plan) return plan;
  }
  const lessons = findLessons(question);
  return {
    title: lessons[0] ? 'Practise ' + lessons[0].title : 'Turn your question into a small experiment',
    concept: lessons[0] ? 'Start with the closest Fieldwork lesson. Identify one concept you can demonstrate with a small, observable example.' : 'Fieldwork has no close lesson match. Narrow your goal to one behaviour you can observe and choose an official reference you can verify.',
    exercise: 'Define one input and the result you expect. Build or run the smallest example that could produce it. Change one assumption, observe the result, and write down what differs.',
    hint: 'Reduce the example to one input, one operation and one observable outcome before adding dependencies.',
    check: 'Explain what changed, how you know, and what new example could prove your explanation incomplete.',
    criteria: ['Make the expected outcome explicit.', 'Record the observed outcome or failure.', 'Explain what you would test next.'],
    origin: lessons.length ? 'catalog' : 'independent', lessons, sources: [],
  };
}
