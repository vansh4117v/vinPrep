export const INTERVIEW_TYPES = [
  {
    id: "technical",
    title: "Technical Interview",
    description: "Algorithm, data structures, and coding challenges",
    icon: "💻",
    path: "/interview?type=technical",
  },
  {
    id: "behavioral",
    title: "Behavioral Interview",
    description: "Leadership, teamwork, and situational questions",
    icon: "🧠",
    path: "/interview?type=behavioral",
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Architecture and scalability discussions",
    icon: "🏗️",
    path: "/interview?type=system-design",
  },
  {
    id: "frontend",
    title: "Frontend Interview",
    description: "React, JavaScript, and UI/UX questions",
    icon: "🎨",
    path: "/interview?type=frontend",
  },
];

export const SKILL_CATEGORIES = [
  {
    id: "communication",
    title: "Communication Skills",
    description: "Improve clarity and articulation",
    exercises: [
      "Practice explaining complex concepts simply",
      "Record yourself answering questions",
      "Work on active listening skills",
    ],
  },
  {
    id: "technical",
    title: "Technical Knowledge",
    description: "Strengthen programming and system knowledge",
    exercises: [
      "Review algorithms and data structures",
      "Practice coding problems daily",
      "Study system design patterns",
    ],
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    description: "Enhance analytical thinking",
    exercises: [
      "Break down complex problems",
      "Practice whiteboard coding",
      "Learn multiple solution approaches",
    ],
  },
  {
    id: "behavioral",
    title: "Behavioral Responses",
    description: "Master the STAR method",
    exercises: [
      "Prepare STAR format examples",
      "Practice storytelling techniques",
      "Reflect on past experiences",
    ],
  },
];

export const PRACTICE_SESSIONS = [
  {
    id: "quick-practice",
    title: "Quick Practice (15 min)",
    description: "Short focused session",
    duration: 15,
    questionCount: 3,
  },
  {
    id: "standard-practice",
    title: "Standard Practice (30 min)",
    description: "Comprehensive interview simulation",
    duration: 30,
    questionCount: 5,
  },
  {
    id: "deep-dive",
    title: "Deep Dive (45 min)",
    description: "In-depth technical assessment",
    duration: 45,
    questionCount: 8,
  },
];
