// ProjectX OS - Seed Data
// Initial mock data for development

import type {
  User,
  Organization,
  Cohort,
  Mission,
  Rubric,
  Badge,
  Assignment,
  Submission,
  Artifact,
} from './types';
import {
  usersStore,
  orgsStore,
  cohortsStore,
  missionsStore,
  rubricsStore,
  badgesStore,
  assignmentsStore,
  submissionsStore,
  artifactsStore,
  currentUserStore,
} from './store';

// =============================================================================
// SEED DATA
// =============================================================================

const ORGANIZATION: Organization = {
  id: 'org_demo',
  name: 'Riverside Academy',
  slug: 'riverside',
  logo: '/images/riverside-logo.png',
  timezone: 'America/New_York',
  settings: {
    allowParentAccess: true,
    requireParentConsent: true,
    academicYear: '2025-2026',
    gradeLevels: ['6', '7', '8', '9', '10', '11', '12'],
  },
  status: 'active',
  plan: 'pro',
  createdAt: '2025-08-01T00:00:00Z',
  updatedAt: '2026-01-30T00:00:00Z',
};

const USERS: User[] = [
  // Admin
  {
    id: 'user_admin',
    email: 'admin@riverside.edu',
    displayName: 'Dr. Sarah Chen',
    avatarUrl: '/avatars/admin.png',
    role: 'admin',
    orgId: 'org_demo',
    cohortIds: [],
    xp: 0,
    level: 1,
    tier: 'Admin',
    currentPhase: 'expand',
    status: 'active',
    onboardedAt: '2025-08-01T00:00:00Z',
    createdAt: '2025-08-01T00:00:00Z',
    updatedAt: '2026-01-30T00:00:00Z',
  },
  // Teachers
  {
    id: 'user_teacher1',
    email: 'msmith@riverside.edu',
    displayName: 'Mr. James Smith',
    avatarUrl: '/avatars/teacher1.png',
    role: 'teacher',
    orgId: 'org_demo',
    cohortIds: ['cohort_7a', 'cohort_7b'],
    xp: 0,
    level: 1,
    tier: 'Teacher',
    currentPhase: 'excel',
    status: 'active',
    onboardedAt: '2025-08-15T00:00:00Z',
    createdAt: '2025-08-15T00:00:00Z',
    updatedAt: '2026-01-30T00:00:00Z',
  },
  // Students
  {
    id: 'user_student1',
    email: 'aria.chen@student.riverside.edu',
    displayName: 'Aria Chen',
    avatarUrl: '/avatars/student1.png',
    role: 'student',
    orgId: 'org_demo',
    cohortIds: ['cohort_7a'],
    xp: 450,
    level: 4,
    tier: 'Silver',
    currentPhase: 'experiment',
    profile: {
      gradeLevel: '7',
      interests: ['robotics', 'coding', 'art'],
    },
    status: 'active',
    onboardedAt: '2025-09-05T00:00:00Z',
    createdAt: '2025-09-05T00:00:00Z',
    updatedAt: '2026-01-30T00:00:00Z',
    lastActiveAt: '2026-01-30T10:00:00Z',
  },
  {
    id: 'user_student2',
    displayName: 'Marcus Johnson',
    role: 'student',
    orgId: 'org_demo',
    cohortIds: ['cohort_7a'],
    xp: 250,
    level: 3,
    tier: 'Bronze',
    currentPhase: 'experience',
    profile: {
      gradeLevel: '7',
      interests: ['gaming', 'music'],
    },
    status: 'active',
    onboardedAt: '2025-09-05T00:00:00Z',
    createdAt: '2025-09-05T00:00:00Z',
    updatedAt: '2026-01-29T00:00:00Z',
    lastActiveAt: '2026-01-29T14:00:00Z',
  },
  {
    id: 'user_student3',
    displayName: 'Sofia Rodriguez',
    role: 'student',
    orgId: 'org_demo',
    cohortIds: ['cohort_7a'],
    xp: 750,
    level: 5,
    tier: 'Silver',
    currentPhase: 'experience',
    profile: {
      gradeLevel: '7',
      interests: ['science', 'nature', 'photography'],
    },
    status: 'active',
    onboardedAt: '2025-09-05T00:00:00Z',
    createdAt: '2025-09-05T00:00:00Z',
    updatedAt: '2026-01-30T00:00:00Z',
    lastActiveAt: '2026-01-30T09:00:00Z',
  },
  // Parent
  {
    id: 'user_parent1',
    email: 'parent.chen@gmail.com',
    displayName: 'Lisa Chen',
    role: 'parent',
    orgId: 'org_demo',
    cohortIds: [],
    linkedChildIds: ['user_student1'],
    xp: 0,
    level: 1,
    tier: 'Parent',
    currentPhase: 'experience',
    status: 'active',
    onboardedAt: '2025-09-10T00:00:00Z',
    createdAt: '2025-09-10T00:00:00Z',
    updatedAt: '2026-01-30T00:00:00Z',
  },
  // Facilitator
  {
    id: 'user_facilitator1',
    email: 'alex@makerlab.org',
    displayName: 'Alex Rivera',
    role: 'facilitator',
    orgId: 'org_demo',
    cohortIds: ['cohort_7a', 'cohort_7b'],
    xp: 0,
    level: 1,
    tier: 'Facilitator',
    currentPhase: 'excel',
    status: 'active',
    onboardedAt: '2025-09-01T00:00:00Z',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2026-01-30T00:00:00Z',
  },
];

const COHORTS: Cohort[] = [
  {
    id: 'cohort_7a',
    name: 'Grade 7A - Innovators',
    code: 'INNOV7A',
    orgId: 'org_demo',
    teacherIds: ['user_teacher1'],
    facilitatorIds: ['user_facilitator1'],
    gradeLevel: '7',
    academicYear: '2025-2026',
    trackIds: ['track_circuits'],
    settings: {
      allowSelfEnroll: false,
      maxStudents: 30,
      startDate: '2025-09-01',
      endDate: '2026-06-15',
    },
    studentCount: 3,
    createdAt: '2025-08-20T00:00:00Z',
    updatedAt: '2026-01-30T00:00:00Z',
  },
  {
    id: 'cohort_7b',
    name: 'Grade 7B - Creators',
    code: 'CREATE7B',
    orgId: 'org_demo',
    teacherIds: ['user_teacher1'],
    gradeLevel: '7',
    academicYear: '2025-2026',
    trackIds: ['track_circuits'],
    settings: {
      allowSelfEnroll: false,
      maxStudents: 30,
    },
    studentCount: 0,
    createdAt: '2025-08-20T00:00:00Z',
    updatedAt: '2026-01-30T00:00:00Z',
  },
];

const RUBRICS: Rubric[] = [
  {
    id: 'rubric_standard',
    name: 'Standard Project Rubric',
    description: 'General rubric for maker projects',
    criteria: [
      {
        id: 'crit_execution',
        name: 'Technical Execution',
        description: 'Quality of the build and functionality',
        weight: 3,
        levels: [
          { score: 1, description: 'Does not function' },
          { score: 2, description: 'Partially functional with issues' },
          { score: 3, description: 'Functional but basic' },
          { score: 4, description: 'Well executed with attention to detail' },
          { score: 5, description: 'Exceptional execution, exceeds expectations' },
        ],
      },
      {
        id: 'crit_creativity',
        name: 'Creativity',
        description: 'Originality and creative problem-solving',
        weight: 2,
        levels: [
          { score: 1, description: 'No creative elements' },
          { score: 2, description: 'Minimal creativity' },
          { score: 3, description: 'Some creative touches' },
          { score: 4, description: 'Creative approach evident' },
          { score: 5, description: 'Highly creative and innovative' },
        ],
      },
      {
        id: 'crit_reflection',
        name: 'Reflection Quality',
        description: 'Depth of learning reflection',
        weight: 2,
        levels: [
          { score: 1, description: 'No meaningful reflection' },
          { score: 2, description: 'Surface-level reflection' },
          { score: 3, description: 'Adequate reflection on learning' },
          { score: 4, description: 'Thoughtful insights on process' },
          { score: 5, description: 'Deep, metacognitive reflection' },
        ],
      },
      {
        id: 'crit_documentation',
        name: 'Documentation',
        description: 'Quality of artifact documentation',
        weight: 1,
        levels: [
          { score: 1, description: 'No documentation' },
          { score: 2, description: 'Minimal documentation' },
          { score: 3, description: 'Adequate documentation' },
          { score: 4, description: 'Clear and detailed documentation' },
          { score: 5, description: 'Exceptional documentation quality' },
        ],
      },
    ],
    maxScore: 40, // 5 * (3+2+2+1)
    passingScore: 24, // 60%
    createdAt: '2025-08-01T00:00:00Z',
    updatedAt: '2025-08-01T00:00:00Z',
  },
];

const MISSIONS: Mission[] = [
  {
    id: 'mission_led',
    title: 'LED Circuit Basics',
    slug: 'led-circuit-basics',
    description: 'Learn the fundamentals of electronics by building your first LED circuit.',
    coverImage: '/images/missions/led-circuit.jpg',
    objective: 'Build a working LED circuit with proper resistor calculations.',
    materials: [
      'Breadboard',
      'LED (any color)',
      '220Ω resistor',
      '9V battery with connector',
      'Jumper wires',
    ],
    steps: [
      {
        order: 1,
        title: 'Understand the Components',
        content: 'Before we start building, let\'s understand what each component does...',
      },
      {
        order: 2,
        title: 'Plan Your Circuit',
        content: 'Draw a simple circuit diagram showing how the components connect...',
      },
      {
        order: 3,
        title: 'Build the Circuit',
        content: 'Follow your diagram to place components on the breadboard...',
      },
      {
        order: 4,
        title: 'Test and Document',
        content: 'Connect the battery and observe. Take photos of your working circuit...',
      },
    ],
    rubricId: 'rubric_standard',
    xpReward: 100,
    badgeId: 'badge_circuit_starter',
    difficulty: 'easy',
    estimatedMinutes: 45,
    status: 'published',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'mission_sensor',
    title: 'Sensor Explorer',
    slug: 'sensor-explorer',
    description: 'Discover how sensors work by building a light-sensitive circuit.',
    coverImage: '/images/missions/sensor.jpg',
    objective: 'Create a circuit that responds to light levels using a photoresistor.',
    materials: [
      'Breadboard',
      'LED',
      'Photoresistor (LDR)',
      '10kΩ resistor',
      '220Ω resistor',
      'Jumper wires',
      '9V battery',
    ],
    steps: [
      {
        order: 1,
        title: 'Learn About Sensors',
        content: 'Sensors convert physical phenomena into electrical signals...',
      },
      {
        order: 2,
        title: 'Build the Voltage Divider',
        content: 'Create a voltage divider circuit with the LDR...',
      },
      {
        order: 3,
        title: 'Add the LED',
        content: 'Connect an LED to visualize the sensor reading...',
      },
      {
        order: 4,
        title: 'Experiment',
        content: 'Cover and uncover the sensor, observe the LED behavior...',
      },
    ],
    prerequisiteMissionIds: ['mission_led'],
    rubricId: 'rubric_standard',
    xpReward: 150,
    badgeId: 'badge_sensor_explorer',
    difficulty: 'medium',
    estimatedMinutes: 60,
    status: 'published',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
  {
    id: 'mission_arduino',
    title: 'Arduino Hello World',
    slug: 'arduino-hello-world',
    description: 'Write your first Arduino program to blink an LED.',
    coverImage: '/images/missions/arduino.jpg',
    objective: 'Program an Arduino to blink an LED at different speeds.',
    materials: [
      'Arduino Uno',
      'USB cable',
      'LED',
      '220Ω resistor',
      'Breadboard',
      'Jumper wires',
    ],
    steps: [
      {
        order: 1,
        title: 'Setup Arduino IDE',
        content: 'Download and install the Arduino IDE on your computer...',
      },
      {
        order: 2,
        title: 'Connect the Circuit',
        content: 'Wire up the LED to pin 13 through a resistor...',
      },
      {
        order: 3,
        title: 'Write the Code',
        content: 'Create a program that turns the LED on and off...',
      },
      {
        order: 4,
        title: 'Modify and Explore',
        content: 'Change the delay times, add patterns...',
      },
    ],
    prerequisiteMissionIds: ['mission_led'],
    rubricId: 'rubric_standard',
    xpReward: 200,
    badgeId: 'badge_coder',
    difficulty: 'medium',
    estimatedMinutes: 90,
    requiredLevel: 3,
    status: 'published',
    createdAt: '2025-09-01T00:00:00Z',
    updatedAt: '2025-09-01T00:00:00Z',
  },
];

const BADGES: Badge[] = [
  {
    id: 'badge_circuit_starter',
    name: 'Circuit Starter',
    description: 'Built your first working electronic circuit.',
    iconUrl: '/badges/circuit-starter.svg',
    color: '#00d4ff',
    rarity: 'common',
    xpBonus: 25,
    criteria: { type: 'mission', missionId: 'mission_led' },
    createdAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'badge_sensor_explorer',
    name: 'Sensor Explorer',
    description: 'Mastered the basics of electronic sensors.',
    iconUrl: '/badges/sensor-explorer.svg',
    color: '#ffd700',
    rarity: 'rare',
    xpBonus: 50,
    criteria: { type: 'mission', missionId: 'mission_sensor' },
    createdAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'badge_coder',
    name: 'Code Crafter',
    description: 'Wrote your first microcontroller program.',
    iconUrl: '/badges/coder.svg',
    color: '#ff6b35',
    rarity: 'rare',
    xpBonus: 50,
    criteria: { type: 'mission', missionId: 'mission_arduino' },
    createdAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'badge_streak_3',
    name: 'On Fire',
    description: 'Completed 3 missions in a row.',
    iconUrl: '/badges/streak.svg',
    color: '#ff4444',
    rarity: 'common',
    xpBonus: 30,
    criteria: { type: 'streak', count: 3 },
    createdAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'badge_level_5',
    name: 'Rising Star',
    description: 'Reached Level 5.',
    iconUrl: '/badges/rising-star.svg',
    color: '#c0c0c0',
    rarity: 'epic',
    xpBonus: 100,
    criteria: { type: 'level', level: 5 },
    createdAt: '2025-08-01T00:00:00Z',
  },
];

const ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign_led_7a',
    missionId: 'mission_led',
    cohortId: 'cohort_7a',
    assignedBy: 'user_teacher1',
    assignedAt: '2026-01-20T00:00:00Z',
    dueDate: '2026-02-03T23:59:59Z',
    status: 'active',
  },
  {
    id: 'assign_sensor_7a',
    missionId: 'mission_sensor',
    cohortId: 'cohort_7a',
    assignedBy: 'user_teacher1',
    assignedAt: '2026-01-27T00:00:00Z',
    dueDate: '2026-02-10T23:59:59Z',
    status: 'active',
  },
];

// =============================================================================
// SAMPLE SUBMISSIONS (for teacher review demo)
// =============================================================================

const ARTIFACTS: Artifact[] = [
  {
    id: 'artifact_1',
    submissionId: 'submission_1',
    type: 'link',
    url: 'https://tinkercad.com/things/abc123',
    linkTitle: 'My LED Circuit',
    linkDescription: 'TinkerCAD simulation of my circuit',
    createdAt: '2026-01-29T14:00:00Z',
  },
  {
    id: 'artifact_2',
    submissionId: 'submission_2',
    type: 'image',
    url: 'https://storage.projectx.school/uploads/sensor-circuit.jpg',
    fileName: 'sensor-circuit.jpg',
    mimeType: 'image/jpeg',
    createdAt: '2026-01-30T10:30:00Z',
  },
];

const SUBMISSIONS: Submission[] = [
  {
    id: 'submission_1',
    studentId: 'user_student2',
    missionId: 'mission_led',
    assignmentId: 'assign_led_7a',
    cohortId: 'cohort_7a',
    artifactIds: ['artifact_1'],
    reflection: 'I learned how resistors protect LEDs from burning out. At first I connected the LED directly and it was super bright but my teacher said that\'s dangerous. Now I understand why we need the resistor!',
    status: 'submitted',
    createdAt: '2026-01-28T10:00:00Z',
    updatedAt: '2026-01-29T14:00:00Z',
    submittedAt: '2026-01-29T14:00:00Z',
  },
  {
    id: 'submission_2',
    studentId: 'user_student3',
    missionId: 'mission_sensor',
    assignmentId: 'assign_sensor_7a',
    cohortId: 'cohort_7a',
    artifactIds: ['artifact_2'],
    reflection: 'The sensor was tricky to calibrate at first. I had to adjust the code multiple times to get accurate readings. I discovered that temperature affects the readings!',
    status: 'submitted',
    createdAt: '2026-01-29T08:00:00Z',
    updatedAt: '2026-01-30T10:30:00Z',
    submittedAt: '2026-01-30T10:30:00Z',
  },
];

// =============================================================================
// SEED FUNCTION
// =============================================================================

export function seedDatabase(): void {
  console.log('[Seed] Initializing mock database...');
  
  // Create organization
  orgsStore.create(ORGANIZATION);
  
  // Create users
  USERS.forEach(user => usersStore.create(user));
  
  // Create cohorts
  COHORTS.forEach(cohort => cohortsStore.create(cohort));
  
  // Create rubrics
  RUBRICS.forEach(rubric => rubricsStore.create(rubric));
  
  // Create missions
  MISSIONS.forEach(mission => missionsStore.create(mission));
  
  // Create badges
  BADGES.forEach(badge => badgesStore.create(badge));
  
  // Create assignments
  ASSIGNMENTS.forEach(assignment => assignmentsStore.create(assignment));
  
  // Create artifacts
  ARTIFACTS.forEach(artifact => artifactsStore.create(artifact));
  
  // Create submissions (for teacher review demo)
  SUBMISSIONS.forEach(submission => submissionsStore.create(submission));
  
  // Set default user to student for demo
  currentUserStore.set(USERS.find(u => u.id === 'user_student1') || null);
  
  console.log('[Seed] Database initialized with mock data');
}
