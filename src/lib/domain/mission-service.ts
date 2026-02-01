/**
 * ProjectX OS — Mission Service
 *
 * Mission management with QR code support.
 * Reference: /docs/GO-LIVE-SPEC.md Section 4
 */

import type { Mission, MissionStep, MissionWithProgress } from '@/types/go-live';
import { getSubmissionForMission } from './submission-service';

// ============================================
// MOCK MISSION DATABASE
// ============================================

const MOCK_MISSIONS: Mission[] = [
  {
    id: 'mission-001',
    title: 'Build Your First Robot',
    description: 'Assemble and program a basic robot using the starter kit.',
    objective: 'Successfully build and program a robot that can move forward and turn.',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    steps: [
      {
        order: 1,
        type: 'read',
        title: 'Introduction to Robotics',
        description: 'Learn the basics of robotics and what makes a robot work.',
        content: 'Robotics combines mechanical engineering, electrical engineering, and computer science...',
        estimatedMinutes: 10,
      },
      {
        order: 2,
        type: 'watch',
        title: 'Unboxing the Kit',
        description: 'Watch how to properly unbox and organize your components.',
        videoUrl: 'https://example.com/videos/unboxing.mp4',
        estimatedMinutes: 5,
      },
      {
        order: 3,
        type: 'do',
        title: 'Assemble the Chassis',
        description: 'Follow the diagram to assemble the robot chassis.',
        imageUrl: '/images/chassis-diagram.png',
        checkpoint: true,
        estimatedMinutes: 20,
      },
      {
        order: 4,
        type: 'do',
        title: 'Connect the Motors',
        description: 'Wire the motors to the motor controller.',
        content: '1. Connect red wire to M1+\n2. Connect black wire to M1-\n3. Repeat for second motor',
        checkpoint: true,
        estimatedMinutes: 15,
      },
      {
        order: 5,
        type: 'do',
        title: 'Upload the Code',
        description: 'Upload the provided code to your microcontroller.',
        content: 'Open the Arduino IDE and upload the code from the kit.',
        estimatedMinutes: 10,
      },
      {
        order: 6,
        type: 'submit',
        title: 'Test Your Robot',
        description: 'Record a video of your robot moving and turning.',
        content: 'Your robot should be able to: move forward for 5 seconds, turn left, move forward again.',
        estimatedMinutes: 10,
      },
      {
        order: 7,
        type: 'reflect',
        title: 'Mission Reflection',
        description: 'Share what you learned and any challenges you faced.',
        content: 'Think about: What was the hardest part? What would you do differently next time?',
        estimatedMinutes: 5,
      },
    ],
    requirements: [
      'Working robot that moves forward',
      'Robot can turn left or right',
      'Video evidence of robot in action',
      'Written reflection (minimum 50 words)',
    ],
    tips: [
      'Make sure all connections are secure before powering on',
      'If motors don\'t work, check the polarity',
      'Test each motor individually first',
    ],
    kitId: 'kit-robotics-starter',
    labLocation: 'Lab 1 - Robotics Station',
    resourceLinks: [
      { title: 'Arduino Guide', url: 'https://arduino.cc/guide', type: 'guide' },
      { title: 'Motor Wiring Tutorial', url: 'https://example.com/motors', type: 'video' },
    ],
    artifactTypes: ['video', 'image'],
    xpReward: 250,
    qrCode: 'PROJECTX-M001',
    status: 'published',
    publishedAt: new Date('2025-01-01'),
    estimatedMinutes: 75,
    difficulty: 2,
    trackId: 'track-robotics',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2025-01-01'),
    createdBy: 'admin-001',
  },
  {
    id: 'mission-002',
    title: 'Solar Energy Explorer',
    description: 'Build a solar-powered device and learn about renewable energy.',
    objective: 'Create a working solar circuit and document the energy output.',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    steps: [
      {
        order: 1,
        type: 'read',
        title: 'Understanding Solar Energy',
        description: 'Learn how solar panels convert sunlight to electricity.',
        content: 'Solar panels use photovoltaic cells to convert light into electrical current...',
        estimatedMinutes: 15,
      },
      {
        order: 2,
        type: 'do',
        title: 'Build the Circuit',
        description: 'Connect the solar panel to the LED through the circuit board.',
        checkpoint: true,
        estimatedMinutes: 20,
      },
      {
        order: 3,
        type: 'do',
        title: 'Measure Energy Output',
        description: 'Use the multimeter to measure voltage in different lighting conditions.',
        estimatedMinutes: 15,
      },
      {
        order: 4,
        type: 'submit',
        title: 'Document Your Findings',
        description: 'Create a report showing your measurements and observations.',
        estimatedMinutes: 20,
      },
      {
        order: 5,
        type: 'reflect',
        title: 'Reflection',
        description: 'How could solar energy be used in your community?',
        estimatedMinutes: 10,
      },
    ],
    requirements: [
      'Working solar circuit',
      'Measurement data in at least 3 lighting conditions',
      'Written report with observations',
    ],
    kitId: 'kit-solar-energy',
    labLocation: 'Lab 2 - Energy Station',
    resourceLinks: [],
    artifactTypes: ['document', 'image'],
    xpReward: 200,
    qrCode: 'PROJECTX-M002',
    status: 'published',
    publishedAt: new Date('2025-01-05'),
    estimatedMinutes: 80,
    difficulty: 2,
    trackId: 'track-sustainability',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2025-01-05'),
    createdBy: 'admin-001',
  },
  {
    id: 'mission-003',
    title: 'Code Your First Game',
    description: 'Create a simple interactive game using Scratch.',
    objective: 'Design and code a game with player controls and scoring.',
    regionId: 'region-mumbai',
    schoolId: 'school-projectx-hq',
    steps: [
      {
        order: 1,
        type: 'read',
        title: 'Game Design Basics',
        description: 'Learn the fundamental elements of game design.',
        estimatedMinutes: 10,
      },
      {
        order: 2,
        type: 'watch',
        title: 'Scratch Tutorial',
        description: 'Watch how to use Scratch to create interactive programs.',
        videoUrl: 'https://scratch.mit.edu/tutorial',
        estimatedMinutes: 15,
      },
      {
        order: 3,
        type: 'do',
        title: 'Create Your Character',
        description: 'Design the main character (sprite) for your game.',
        checkpoint: true,
        estimatedMinutes: 15,
      },
      {
        order: 4,
        type: 'do',
        title: 'Add Movement',
        description: 'Program the character to move with arrow keys.',
        checkpoint: true,
        estimatedMinutes: 20,
      },
      {
        order: 5,
        type: 'do',
        title: 'Add Scoring',
        description: 'Create a scoring system for your game.',
        estimatedMinutes: 15,
      },
      {
        order: 6,
        type: 'submit',
        title: 'Share Your Game',
        description: 'Record gameplay footage and share the project link.',
        estimatedMinutes: 10,
      },
      {
        order: 7,
        type: 'reflect',
        title: 'Game Reflection',
        description: 'What would you add to make the game more fun?',
        estimatedMinutes: 5,
      },
    ],
    requirements: [
      'Playable game with character movement',
      'Working scoring system',
      'Gameplay video (30+ seconds)',
    ],
    resourceLinks: [
      { title: 'Scratch', url: 'https://scratch.mit.edu', type: 'external' },
    ],
    artifactTypes: ['video', 'link'],
    xpReward: 300,
    qrCode: 'PROJECTX-M003',
    status: 'published',
    publishedAt: new Date('2025-01-10'),
    estimatedMinutes: 90,
    difficulty: 3,
    trackId: 'track-coding',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-10'),
    createdBy: 'admin-001',
  },
];

// ============================================
// MISSION CRUD
// ============================================

/**
 * Get mission by ID
 */
export async function getMission(id: string): Promise<Mission | null> {
  return MOCK_MISSIONS.find((m) => m.id === id) || null;
}

/**
 * Get mission by QR code
 */
export async function getMissionByQR(qrCode: string): Promise<Mission | null> {
  return MOCK_MISSIONS.find((m) => m.qrCode === qrCode) || null;
}

/**
 * Get all published missions for school
 */
export async function getMissionsForSchool(schoolId: string): Promise<Mission[]> {
  return MOCK_MISSIONS.filter(
    (m) => m.schoolId === schoolId && m.status === 'published'
  );
}

/**
 * Get missions with progress for student
 */
export async function getMissionsWithProgress(
  studentId: string,
  schoolId: string
): Promise<MissionWithProgress[]> {
  const missions = await getMissionsForSchool(schoolId);
  const result: MissionWithProgress[] = [];

  for (const mission of missions) {
    const submission = await getSubmissionForMission(studentId, mission.id);

    let progress = 0;
    if (submission) {
      if (submission.status === 'APPROVED') {
        progress = 100;
      } else if (submission.status === 'DRAFT') {
        // Calculate based on artifacts and steps
        progress = Math.min(
          submission.artifacts.length * 10 + (submission.selfReflection ? 10 : 0),
          50
        );
      } else {
        progress = 75; // Submitted but not approved
      }
    }

    result.push({
      mission,
      submission: submission || undefined,
      progress,
    });
  }

  return result;
}

/**
 * Get active missions (in progress) for student
 */
export async function getActiveMissions(
  studentId: string,
  schoolId: string
): Promise<MissionWithProgress[]> {
  const allMissions = await getMissionsWithProgress(studentId, schoolId);
  return allMissions.filter(
    (m) => m.submission && !['APPROVED', 'REJECTED'].includes(m.submission.status)
  );
}

/**
 * Get available missions (not started) for student
 */
export async function getAvailableMissions(
  studentId: string,
  schoolId: string
): Promise<Mission[]> {
  const allMissions = await getMissionsWithProgress(studentId, schoolId);
  return allMissions.filter((m) => !m.submission).map((m) => m.mission);
}

/**
 * Get completed missions for student
 */
export async function getCompletedMissions(
  studentId: string,
  schoolId: string
): Promise<MissionWithProgress[]> {
  const allMissions = await getMissionsWithProgress(studentId, schoolId);
  return allMissions.filter((m) => m.submission?.status === 'APPROVED');
}

// ============================================
// MISSION MANAGEMENT (ADMIN)
// ============================================

/**
 * Create a new mission (admin only)
 */
export async function createMission(
  mission: Omit<Mission, 'id' | 'createdAt' | 'updatedAt' | 'qrCode'>
): Promise<Mission> {
  const now = new Date();
  const newMission: Mission = {
    ...mission,
    id: `mission-${Date.now()}`,
    qrCode: `PROJECTX-M${Date.now().toString().slice(-6)}`,
    createdAt: now,
    updatedAt: now,
  };

  MOCK_MISSIONS.push(newMission);
  return newMission;
}

/**
 * Update mission (admin only)
 */
export async function updateMission(
  id: string,
  updates: Partial<Mission>
): Promise<Mission | null> {
  const mission = MOCK_MISSIONS.find((m) => m.id === id);
  if (!mission) return null;

  Object.assign(mission, updates, { updatedAt: new Date() });
  return mission;
}

/**
 * Publish mission (admin only)
 */
export async function publishMission(id: string): Promise<Mission | null> {
  return updateMission(id, {
    status: 'published',
    publishedAt: new Date(),
  });
}

/**
 * Unpublish mission (admin only)
 */
export async function unpublishMission(id: string): Promise<Mission | null> {
  return updateMission(id, {
    status: 'draft',
    publishedAt: undefined,
  });
}

// ============================================
// QR CODE GENERATION
// ============================================

/**
 * Generate QR code URL for mission
 */
export function generateQRCodeUrl(missionId: string, baseUrl: string): string {
  return `${baseUrl}/mission/${missionId}`;
}

/**
 * Generate QR code SVG data URL
 * In production: Use a proper QR code library like qrcode
 */
export function generateQRCodeSVG(content: string): string {
  // Placeholder - in production use qrcode library
  // npm install qrcode
  // import QRCode from 'qrcode';
  // return await QRCode.toDataURL(content);
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" fill="black" font-size="12">
        QR: ${content}
      </text>
    </svg>
  `)}`;
}

// ============================================
// STATISTICS
// ============================================

/**
 * Get mission statistics
 */
export async function getMissionStats(schoolId: string): Promise<{
  totalMissions: number;
  publishedMissions: number;
  draftMissions: number;
  totalSubmissions: number;
  completionRate: number;
}> {
  const missions = MOCK_MISSIONS.filter((m) => m.schoolId === schoolId);

  return {
    totalMissions: missions.length,
    publishedMissions: missions.filter((m) => m.status === 'published').length,
    draftMissions: missions.filter((m) => m.status === 'draft').length,
    totalSubmissions: 0, // TODO: Calculate from submissions
    completionRate: 0, // TODO: Calculate from submissions
  };
}
