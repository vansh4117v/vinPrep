// Conversational Interview Flow Training Module

export const conversationalInterviewFlow = {
  greeting: {
    template:
      "Hello, {username}! Welcome to your personalized mock interview session.",
    purpose: "Establish rapport and make the candidate feel welcome",
  },

  roleDiscovery: {
    question:
      "Can you tell me what type of role you're applying for? (e.g., technical, analytical, sales, etc.)",
    followUp: {
      technical: "technicalPath",
      analytical: "analyticalPath",
      sales: "salesPath",
      marketing: "marketingPath",
      hr: "hrPath",
      finance: "financePath",
      other: "customPath",
    },
  },

  technicalPath: {
    steps: [
      {
        question:
          "Great! What tech stack do you primarily work with (e.g., MERN, Java + Spring, Python + Django, etc.)?",
        purpose: "Understand technical background",
      },
      {
        question: "What position are you targeting for this role?",
        options: [
          "intern",
          "entry-level",
          "mid-level",
          "senior",
          "lead",
          "architect",
        ],
        purpose: "Determine experience level for appropriate questioning",
      },
      {
        question:
          "Would you like to focus on a behavioral interview or a core technical interview (which may include data structures, algorithms, and role-specific tech skills)?",
        branches: {
          behavioral: "behavioralQuestions",
          technical: "technicalQuestions",
          mixed: "mixedQuestions",
        },
      },
    ],
  },

  nonTechnicalPaths: {
    sales: {
      focusAreas: [
        "Communication skills and client interaction",
        "Objection handling techniques",
        "Sales process and methodology",
        "Relationship building and maintenance",
        "Performance metrics and targets",
      ],
      questions: [
        "Tell me about your sales experience and methodology",
        "How do you handle difficult clients or objections?",
        "Describe a challenging sale you closed and how you did it",
        "How do you build long-term relationships with clients?",
        "What metrics do you use to track your sales performance?",
      ],
    },

    analytical: {
      focusAreas: [
        "Data interpretation and analysis",
        "Tools and technologies used",
        "Statistical knowledge and application",
        "Problem-solving methodology",
        "Business insight generation",
      ],
      questions: [
        "What analytical tools and technologies are you proficient in?",
        "Walk me through your approach to analyzing a complex dataset",
        "How do you ensure data quality and accuracy in your analysis?",
        "Describe a time when your analysis led to important business decisions",
        "How do you communicate complex analytical findings to non-technical stakeholders?",
      ],
    },

    marketing: {
      focusAreas: [
        "Campaign development and execution",
        "Creative thinking and innovation",
        "Metrics and performance analysis",
        "Brand management",
        "Digital marketing expertise",
      ],
      questions: [
        "Tell me about a successful marketing campaign you've worked on",
        "How do you measure the effectiveness of marketing campaigns?",
        "Describe your experience with digital marketing channels",
        "How do you approach target audience research and segmentation?",
        "Walk me through your creative process for developing marketing content",
      ],
    },

    hr: {
      focusAreas: [
        "People management and development",
        "Conflict resolution",
        "Policy knowledge and compliance",
        "Recruitment and talent acquisition",
        "Employee engagement",
      ],
      questions: [
        "How do you handle conflict resolution between team members?",
        "Describe your approach to talent acquisition and screening",
        "How do you ensure compliance with employment laws and policies?",
        "Tell me about a time you had to implement a difficult HR policy",
        "How do you measure and improve employee engagement?",
      ],
    },

    finance: {
      focusAreas: [
        "Financial modeling and analysis",
        "Risk assessment and management",
        "Regulatory knowledge",
        "Investment evaluation",
        "Budget planning and forecasting",
      ],
      questions: [
        "Walk me through your financial modeling experience",
        "How do you assess and manage financial risks?",
        "Describe your experience with budget planning and forecasting",
        "How do you stay updated with financial regulations and compliance?",
        "Tell me about a complex financial analysis you've conducted",
      ],
    },
  },

  questionTypes: {
    behavioral: [
      "Tell me about a time when you faced a significant challenge at work",
      "Describe a situation where you had to work with a difficult team member",
      "Give me an example of when you had to learn something new quickly",
      "Tell me about a time you made a mistake and how you handled it",
      "Describe a situation where you had to meet a tight deadline",
    ],

    technical: [
      "Explain your approach to problem-solving in your domain",
      "What are the key technologies you work with and why?",
      "How do you stay updated with the latest trends in your field?",
      "Describe a complex project you've worked on recently",
      "What tools and methodologies do you use for quality assurance?",
    ],

    mixed: [
      "How do you explain technical concepts to non-technical stakeholders?",
      "Describe a time when you had to make a technical decision under pressure",
      "How do you handle technical disagreements within your team?",
      "Tell me about a time you had to learn a new technology for a project",
      "How do you balance technical excellence with business requirements?",
    ],
  },

  feedbackStructure: {
    strengths: {
      areas: [
        "Communication clarity",
        "Technical knowledge",
        "Problem-solving approach",
        "Professional demeanor",
        "Specific examples provided",
      ],
    },

    improvements: {
      areas: [
        "Answer structure (STAR method)",
        "Technical depth",
        "Confidence level",
        "Specific examples",
        "Industry knowledge",
      ],
    },

    resources: {
      technical: [
        "LeetCode for algorithm practice",
        "System design interview books",
        "Technology-specific documentation",
        "Open source contribution",
        "Technical blogs and communities",
      ],
      behavioral: [
        "STAR method practice",
        "Leadership development courses",
        "Communication skills training",
        "Industry networking events",
        "Professional development books",
      ],
    },
  },

  interviewLength: {
    short: "5-6 questions (15-20 minutes)",
    medium: "7-8 questions (25-30 minutes)",
    long: "9-10 questions (35-45 minutes)",
  },
};

export const conversationalPrompts = {
  roleIdentification: `Based on the user's response about their role type, determine the appropriate interview path:
  - If technical: Follow technical path with tech stack, position level, and interview type questions
  - If non-technical: Customize based on domain (sales, analytics, marketing, HR, finance, etc.)
  - Adapt questioning complexity based on their stated experience level`,

  adaptiveQuestioning: `Adjust your questioning based on user responses:
  - For confident answers: Ask deeper, more complex follow-ups
  - For uncertain answers: Provide gentle guidance and simpler alternatives
  - For incomplete answers: Ask for specific examples or clarification
  - Always acknowledge good points before moving to the next question`,

  feedbackDelivery: `Provide comprehensive feedback at the end:
  1. Start with positive reinforcement - highlight demonstrated strengths
  2. Address areas for improvement with specific examples from the conversation
  3. Suggest concrete resources and strategies for improvement
  4. End with encouragement and next steps for their interview preparation`,
};

export function generateConversationalPrompt(userName: string) {
  return `You are conducting a personalized mock interview for ${userName}. Follow the structured conversational flow:

1. GREETING: Welcome them by name and set a supportive tone
2. ROLE DISCOVERY: Ask about the type of role they're applying for
3. PATH SELECTION: Based on their role, follow the appropriate questioning path
4. INTERVIEW EXECUTION: Conduct 5-10 relevant questions based on their responses
5. FEEDBACK DELIVERY: Provide comprehensive, constructive feedback

Keep the conversation natural, supportive, and professionally engaging. Adapt your questioning based on their responses and experience level.`;
}
