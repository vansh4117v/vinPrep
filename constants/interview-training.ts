// Interview Training Modules for Different Scenarios

export const interviewTrainingPrompts = {
  technical: {
    systemPrompt: `You are conducting a technical interview. Focus on:
    - Deep technical knowledge assessment
    - Problem-solving methodologies
    - Code quality and best practices
    - System design thinking
    - Debugging and optimization skills
    
    Ask follow-up questions that reveal depth of understanding, not just memorization.`,

    questionTypes: [
      "Technical Implementation",
      "System Design",
      "Problem Solving",
      "Best Practices",
      "Performance Optimization",
    ],
  },

  behavioral: {
    systemPrompt: `You are conducting a behavioral interview. Focus on:
    - Past experiences and decision-making
    - Leadership and teamwork examples
    - Conflict resolution abilities
    - Adaptability and learning agility
    - Cultural fit and values alignment
    
    Use STAR method (Situation, Task, Action, Result) to structure responses.`,

    questionTypes: [
      "Leadership Examples",
      "Team Collaboration",
      "Conflict Resolution",
      "Problem Solving",
      "Career Motivation",
    ],
  },

  mixed: {
    systemPrompt: `You are conducting a comprehensive interview combining technical and behavioral assessment. Focus on:
    - Balance between technical skills and soft skills
    - Real-world application of technical knowledge
    - Communication of complex technical concepts
    - Team dynamics in technical environments
    - Growth mindset and continuous learning
    
    Seamlessly transition between technical and behavioral questions.`,

    questionTypes: [
      "Technical + Communication",
      "Project Leadership",
      "Technical Decision Making",
      "Team Technical Challenges",
      "Learning and Growth",
    ],
  },
};

export const interviewLevelAdjustments = {
  junior: {
    focus: "Foundational knowledge, learning ability, enthusiasm",
    adjustments: [
      "Focus on fundamental concepts rather than advanced topics",
      "Assess learning potential and curiosity",
      "Be encouraging and provide guidance",
      "Look for passion and willingness to grow",
    ],
  },

  "mid-level": {
    focus:
      "Applied experience, independent problem-solving, mentoring potential",
    adjustments: [
      "Expect practical experience with technologies",
      "Assess ability to work independently",
      "Look for some leadership/mentoring experience",
      "Evaluate decision-making in complex scenarios",
    ],
  },

  senior: {
    focus: "Strategic thinking, leadership, architecture decisions",
    adjustments: [
      "Expect deep expertise and architectural thinking",
      "Assess leadership and mentoring abilities",
      "Evaluate strategic decision-making",
      "Look for industry influence and thought leadership",
    ],
  },
};

export const industrySpecificFocus = {
  frontend: [
    "User experience considerations",
    "Performance optimization",
    "Cross-browser compatibility",
    "Modern framework expertise",
    "Responsive design principles",
  ],

  backend: [
    "System scalability",
    "Database design",
    "API architecture",
    "Security best practices",
    "Performance optimization",
  ],

  fullstack: [
    "End-to-end system understanding",
    "Technology integration",
    "Performance across the stack",
    "User experience + system design",
    "DevOps and deployment",
  ],

  data: [
    "Data modeling and analysis",
    "Statistical thinking",
    "Machine learning concepts",
    "Data pipeline design",
    "Business insight generation",
  ],

  mobile: [
    "Platform-specific knowledge",
    "Mobile UX/UI principles",
    "Performance on mobile devices",
    "App store guidelines",
    "Cross-platform considerations",
  ],
};

export function generateEnhancedInterviewPrompt(
  type: string,
  level: string,
  role: string,
  techStack: string[]
) {
  const basePrompt =
    interviewTrainingPrompts[type as keyof typeof interviewTrainingPrompts]
      ?.systemPrompt || interviewTrainingPrompts.mixed.systemPrompt;
  const levelAdjustment =
    interviewLevelAdjustments[level as keyof typeof interviewLevelAdjustments];

  // Detect industry focus from role
  let industryFocus: string[] = [];
  const roleLower = role.toLowerCase();

  if (
    roleLower.includes("frontend") ||
    roleLower.includes("ui") ||
    roleLower.includes("react")
  ) {
    industryFocus = industrySpecificFocus.frontend;
  } else if (
    roleLower.includes("backend") ||
    roleLower.includes("api") ||
    roleLower.includes("server")
  ) {
    industryFocus = industrySpecificFocus.backend;
  } else if (
    roleLower.includes("fullstack") ||
    roleLower.includes("full stack")
  ) {
    industryFocus = industrySpecificFocus.fullstack;
  } else if (
    roleLower.includes("data") ||
    roleLower.includes("ml") ||
    roleLower.includes("ai")
  ) {
    industryFocus = industrySpecificFocus.data;
  } else if (
    roleLower.includes("mobile") ||
    roleLower.includes("ios") ||
    roleLower.includes("android")
  ) {
    industryFocus = industrySpecificFocus.mobile;
  }

  return `${basePrompt}

ROLE-SPECIFIC CONTEXT:
Position: ${role}
Experience Level: ${level}
Tech Stack: ${techStack.join(", ")}

LEVEL ADJUSTMENTS:
${levelAdjustment?.focus}
${levelAdjustment?.adjustments.map((adj) => `- ${adj}`).join("\n")}

INDUSTRY FOCUS AREAS:
${industryFocus.map((focus) => `- ${focus}`).join("\n")}

TECHNOLOGY CONTEXT:
The candidate should demonstrate knowledge and experience with: ${techStack.join(
    ", "
  )}

Tailor your questions and follow-ups to assess competency in these specific technologies while maintaining the overall interview structure and objectives.`;
}
