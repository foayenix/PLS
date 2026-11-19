import type { Project } from './practice';

export const roboticsSources = [
  { title: 'Robotisim mobile robotics', url: 'https://github.com/Robotisim/mobile_robotics_engineer', use: 'Follow the sequence from a basic mobile robot to sensors, control, SLAM and navigation.' },
  { title: 'Mike Likes Robots', url: 'https://mikelikesrobots.github.io/blog/getting-started-robot-sw-eng/', use: 'Read before your first build, then revisit when setting up physical hardware.' },
  { title: 'Mithi’s Robotics Coursework', url: 'https://github.com/mithi/robotics-coursework', use: 'Choose individual lectures to fill gaps in transforms, control or SLAM.' },
  { title: 'Udacity ROS project examples', url: 'https://github.com/felipenmartins/ROS_projects_Udacity', use: 'Borrow briefs for mapping and delivery. The examples use ROS Kinetic.' },
  { title: 'ML & Robotics Interview Preparation', url: 'https://github.com/BarisYazici/ml_robotics_interview_prep', use: 'Practise explaining coordinate frames, calibration, estimation and SLAM after your first build.' },
  { title: 'Awesome Robotics', url: 'https://github.com/kiloreux/awesome-robotics', use: 'Look up books or lectures when a project exposes a gap.' },
  { title: 'Robotics AI Roadmap', url: 'https://github.com/h9-tect/AI-Roadmaps/blob/main/robotics-ai-roadmap.md', use: 'Review prerequisites and choose one resource for the concept you need next.' },
  { title: 'Mike Royal’s Robotics Guide', url: 'https://github.com/mikeroyal/Robotics-guide', use: 'Compare tools as needed. Check current upstream docs before following setup instructions.' },
];

const ros = { title: 'ROS 2 Jazzy tutorials', url: 'https://docs.ros.org/en/jazzy/Tutorials.html' };
const nav = { title: 'Nav2 quickstart', url: 'https://docs.nav2.org/jazzy/getting_started/' };
const gazebo = { title: 'Nav2 robot setup in Gazebo', url: 'https://docs.nav2.org/jazzy/configuration_and_development/first_time_robot_setup_guide/gazebo/' };
const odometry = { title: 'Modern Robotics, Chapter 13', url: 'https://modernrobotics.northwestern.edu/chapters/chapter13/' };
const apriltag = { title: 'AprilTag ROS 2 node', url: 'https://github.com/christianrauch/apriltag_ros' };

export const roboticsProjects: Project[] = [
  {
    id: 'ros2-diagnostics', name: 'ROS 2 diagnostics and replay', tag: 'C++ & ROBOT TELEMETRY',
    track: 'Robotics', level: 'Foundations', color: '#437873', evidenceBundle: true,
    description: 'Build a C++ ROS 2 node that detects stale odometry and reports recovery.',
    applies: 'December 2026 to February 2027',
    brief: 'Subscribe to simulated odometry. Emit a health transition when samples stop arriving and when they return. Separate the health rule from its ROS 2 wrapper so you can test it deterministically. Record and replay a failing run.',
    prerequisites: ['Linux terminal and Git', 'C++ functions and classes', 'ROS 2 publishers and subscribers'],
    milestones: ['Bring up a simulated publisher and inspect the topic and message rate.', 'Implement waiting, healthy and stale states with an explicit clock and timeout.', 'Record a failing run, replay it in a clean workspace and run the tests.'],
    checks: ['Tests cover startup, healthy updates, stale data and recovery.', 'Pause or clock-reset behaviour is documented and exercised.', 'A bag or synthetic fixture reproduces the failure.', 'A short demo and test report explain the fix.'],
    sources: [ros, nav],
  },
  {
    id: 'indoor-delivery-rover', name: 'Autonomous indoor delivery rover', tag: 'SLAM & NAVIGATION',
    track: 'Robotics', level: 'Capstone', color: '#53669a', evidenceBundle: true,
    description: 'Map an indoor space, localise on a saved map and deliver to waypoints.',
    applies: 'March to May 2027 · transfer to hardware September to December',
    brief: 'Use ROS 2 Jazzy, Gazebo Harmonic and Nav2 on a differential-drive rover. Define a delivery mission and run reproducible trials against a clear route, a blocked route and uncertain localisation. Bring the same mission onto physical hardware later in the year.',
    prerequisites: ['ROS 2 topics, actions and launch', 'Transform frames and wheel odometry', 'Diagnostic records from the first project'],
    milestones: ['Start a sourced simulation from clean setup instructions and record a teleoperated map.', 'Localise on the saved map and implement a waypoint mission with explicit outcomes.', 'Run a fixed test matrix and report completion, timeouts and recovery.', 'Repeat one waypoint mission on a physical rover and document what changed.'],
    checks: ['A clean launch reproduces the map and mission.', 'Three scenario types have repeated trials and recorded outcomes.', 'The demo and report show a real investigation and its limits.', 'Simulator-only and hardware results are clearly labelled.'],
    sources: [nav, gazebo, odometry],
  },
  {
    id: 'camera-guided-docking', name: 'Camera-guided docking', tag: 'PERCEPTION & CONTROL',
    track: 'Robotics', level: 'Intermediate', color: '#89683b', evidenceBundle: true,
    description: 'Guide the rover to a docking marker and handle lost tracking.',
    applies: 'June to August 2027 · optional physical transfer after the waypoint run',
    brief: 'Estimate the docking marker pose with a calibrated camera. Convert it to the rover frame and approach from several starting angles in simulation. Define conditions for approach, stop, and manual reset. Treat missing or stale detections as a reason to stop.',
    prerequisites: ['Basic camera calibration', 'ROS 2 transforms and timestamps', 'A working simulated rover'],
    milestones: ['Visualise the marker pose and verify the transform by changing the starting angle.', 'Implement a bounded approach and a stop path for lost detections in simulation.', 'Measure docking error, success rate and marker-loss behaviour across a fixed set of trials.'],
    checks: ['Pose and timestamps are checked in the rover frame.', 'Marker loss and stale detections trigger a stop in simulation.', 'The results compare multiple angles and lighting conditions.', 'The demo and report document residual position and heading error.'],
    sources: [apriltag, gazebo],
  },
];

export const roboticsMilestones = [
  { id: 'diagnostics', when: 'Dec 2026–Feb 2027', title: 'Write and test your first ROS 2 node', task: 'Use two study blocks a week for Linux, C++ and ROS 2 while finishing one deployable AI automation build. Apply for AI engineering and automation roles when you can explain its tests and demo.', evidence: 'A C++ diagnostics node, recorded failure and repeatable tests.', project: 'ros2-diagnostics', lesson: 'ros2-topics' },
  { id: 'navigation', when: 'Mar–May 2027', title: 'Map, localise and navigate', task: 'Build and test the indoor delivery rover in Gazebo. Begin applying for junior robotics software, simulation, testing and integration roles once you can demonstrate a mission and diagnose a failure.', evidence: 'A reproducible demo, saved map and first navigation trial report.', project: 'indoor-delivery-rover', lesson: 'navigation' },
  { id: 'docking', when: 'Jun–Aug 2027', title: 'Use vision to dock the rover', task: 'Add a marker-based docking mode. Vary angle and lighting, replay failure data and measure the effect of your changes.', evidence: 'A docking demo, residual error report and tests for losing the marker.', project: 'camera-guided-docking', lesson: 'docking' },
  { id: 'hardware', when: 'Sep–Dec 2027', title: 'Bring one mission onto hardware', task: 'Find access to a rover through a kit, lab or team. Repeat a waypoint mission under supervision, log a real failure and compare the run with your simulation. Docking transfer is an extension.', evidence: 'A physical waypoint run, setup notes and one field-debugging case study.', project: 'indoor-delivery-rover', lesson: 'hardware' },
];

export const roboticsDrills = [
  { id: 'robotics-odometry', type: 'Robotics debugging', title: 'Odometry goes quiet', minutes: 20, project: 'ros2-diagnostics',
    prompt: 'Show how you would distinguish a paused simulation, a missing publisher and a subscriber failing to receive messages.',
    example: 'The last accepted message was 1.6 seconds ago. The timeout is 1 second. Messages return five seconds later.',
    rubric: ['State the clock used and the behaviour during a pause.', 'Inspect the graph, topic rate and publisher/subscriber compatibility.', 'Describe a bag or fixture that reproduces the transition and recovery.'] },
  { id: 'robotics-navigation', type: 'Robotics system design', title: 'A rover cannot clear a doorway', minutes: 25, project: 'indoor-delivery-rover',
    prompt: 'Explain how you would reproduce the failure and isolate map, localisation, footprint, planner and controller issues.',
    example: 'A plan is visible in RViz but the rover oscillates at the doorway. It succeeds from another starting pose.',
    rubric: ['Separate the planned route, pose estimate and actual motion.', 'Name evidence that would rule in or out at least two causes.', 'Propose one controlled change and a repeatable comparison.'] },
  { id: 'robotics-docking', type: 'Perception evaluation', title: 'Docking succeeds head-on and fails at an angle', minutes: 20, project: 'camera-guided-docking',
    prompt: 'Design tests that separate pose quality, calibration and control behaviour. Explain when the approach should stop.',
    example: 'The tag flickers out of view during turns. At 30° the rover stops 18 cm off centre.',
    rubric: ['Measure heading and position independently.', 'Check timestamps and frame transforms with a stationary reference.', 'Define what counts as success, a time-out and a stop on marker loss.'] },
];
