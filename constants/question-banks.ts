// Domain-specific question banks for the conversational interview bot

export const domainQuestionBanks = {
  technical: {
    beginner: {
      behavioral: [
        "Tell me about a programming project you're most proud of",
        "Describe a time when you had to learn a new technology quickly",
        "How do you approach debugging when your code isn't working?",
        "Tell me about a time you worked on a team project. What was your role?",
        "Describe a technical challenge you faced and how you solved it",
      ],
      technical: [
        "Explain the difference between arrays and linked lists",
        "What is the purpose of version control systems like Git?",
        "How would you explain object-oriented programming to someone new?",
        "What are the basic principles of responsive web design?",
        "Describe what happens when you type a URL into a browser",
      ],
    },

    intermediate: {
      behavioral: [
        "Tell me about a time you had to make a technical decision with limited information",
        "Describe a situation where you had to refactor existing code. What was your approach?",
        "How do you handle code reviews and feedback from senior developers?",
        "Tell me about a time you had to explain a complex technical concept to a non-technical person",
        "Describe a project where you had to balance technical debt with new feature development",
      ],
      technical: [
        "How would you design a scalable web application architecture?",
        "Explain the differences between SQL and NoSQL databases and when to use each",
        "What are microservices and what are their advantages and disadvantages?",
        "How do you ensure code quality and maintainability in your projects?",
        "Describe your approach to API design and best practices",
      ],
    },

    senior: {
      behavioral: [
        "Tell me about a time you led a technical team through a challenging project",
        "Describe how you've mentored junior developers and helped them grow",
        "How do you handle technical disagreements within your team?",
        "Tell me about a time you had to make an architectural decision that affected the entire system",
        "Describe a situation where you had to balance business requirements with technical constraints",
      ],
      technical: [
        "How would you design a system to handle millions of users?",
        "Describe your approach to system monitoring and observability",
        "How do you evaluate and introduce new technologies into your tech stack?",
        "What's your strategy for managing technical debt in a large codebase?",
        "How do you ensure security best practices across your applications?",
      ],
    },
  },

  sales: {
    questions: [
      "Walk me through your typical sales process from lead to close",
      "Tell me about the most challenging sale you've ever made",
      "How do you handle objections about price or budget constraints?",
      "Describe your approach to building long-term client relationships",
      "How do you stay motivated during periods of low sales performance?",
      "Tell me about a time you lost a big deal. What did you learn?",
      "How do you research and qualify potential prospects?",
      "Describe a time when you exceeded your sales targets significantly",
      "How do you handle rejection and maintain a positive attitude?",
      "What CRM tools and sales technologies are you familiar with?",
    ],
  },

  analytics: {
    questions: [
      "Walk me through your process for analyzing a new dataset",
      "How do you ensure data quality and identify potential issues?",
      "Describe a time when your analysis led to significant business insights",
      "What tools and programming languages do you use for data analysis?",
      "How do you communicate complex findings to non-technical stakeholders?",
      "Tell me about a challenging data problem you solved",
      "How do you approach A/B testing and statistical significance?",
      "Describe your experience with data visualization tools",
      "How do you handle missing or inconsistent data?",
      "What's your approach to predictive modeling and machine learning?",
    ],
  },

  marketing: {
    questions: [
      "Tell me about a successful marketing campaign you've managed",
      "How do you measure the ROI of your marketing efforts?",
      "Describe your experience with digital marketing channels",
      "How do you approach market research and audience segmentation?",
      "Tell me about a campaign that didn't perform well. What did you learn?",
      "How do you stay updated with marketing trends and best practices?",
      "Describe your process for developing creative marketing content",
      "How do you collaborate with sales teams to generate qualified leads?",
      "What marketing automation tools have you used?",
      "How do you approach brand positioning and messaging?",
    ],
  },

  hr: {
    questions: [
      "How do you handle employee conflicts and disciplinary actions?",
      "Describe your approach to talent acquisition and candidate screening",
      "Tell me about a time you had to implement a difficult policy change",
      "How do you ensure compliance with employment laws and regulations?",
      "Describe your experience with performance management systems",
      "How do you measure and improve employee engagement?",
      "Tell me about a challenging termination you had to handle",
      "How do you approach diversity and inclusion initiatives?",
      "Describe your experience with HR information systems",
      "How do you handle confidential employee information?",
    ],
  },

  finance: {
    questions: [
      "Walk me through your financial modeling process",
      "How do you assess and manage financial risks?",
      "Describe your experience with budget planning and forecasting",
      "Tell me about a complex financial analysis you've conducted",
      "How do you stay updated with financial regulations and compliance?",
      "Describe a time when you identified cost-saving opportunities",
      "How do you present financial information to non-finance stakeholders?",
      "What financial software and tools are you proficient in?",
      "How do you approach investment evaluation and decision-making?",
      "Tell me about a time you had to explain a financial discrepancy",
    ],
  },
};

export const followUpQuestions = {
  depth: [
    "Can you give me a specific example of that?",
    "What was the outcome of that situation?",
    "How did you measure the success of that approach?",
    "What would you do differently next time?",
    "What challenges did you face during that process?",
  ],

  clarification: [
    "Can you elaborate on that point?",
    "What do you mean by that specifically?",
    "How did that impact the overall project?",
    "What was your role in that situation?",
    "Can you walk me through your thought process?",
  ],

  technical: [
    "How would you explain that to someone without a technical background?",
    "What alternatives did you consider?",
    "How did you ensure the quality of your solution?",
    "What tools or frameworks did you use?",
    "How would you scale that solution for larger volumes?",
  ],
};

export const feedbackTemplates = {
  strengths: {
    communication:
      "You demonstrated excellent communication skills throughout our conversation",
    technical:
      "Your technical knowledge and problem-solving approach were impressive",
    examples:
      "You provided specific, concrete examples that really illustrated your experience",
    confidence:
      "You showed great confidence and composure during the interview",
    depth: "You showed deep understanding of the concepts we discussed",
  },

  improvements: {
    structure:
      "Consider using the STAR method (Situation, Task, Action, Result) to structure your responses",
    examples: "Try to provide more specific examples with quantifiable results",
    technical:
      "Consider deepening your knowledge in [specific area] for this type of role",
    confidence:
      "Practice speaking with more confidence about your achievements",
    clarity: "Work on explaining complex concepts in simpler terms",
  },

  resources: {
    technical: {
      books: [
        "Clean Code",
        "System Design Interview",
        "Cracking the Coding Interview",
      ],
      websites: ["LeetCode", "HackerRank", "System Design Primer"],
      courses: [
        "Algorithm courses",
        "System design courses",
        "Technology-specific training",
      ],
    },
    behavioral: {
      books: [
        "Crucial Conversations",
        "The First 90 Days",
        "Leadership in Turbulent Times",
      ],
      methods: [
        "STAR method practice",
        "Mock interview sessions",
        "Storytelling workshops",
      ],
      skills: [
        "Public speaking",
        "Leadership development",
        "Communication training",
      ],
    },
  },
};

export function getQuestionsByDomain(
  domain: string,
  level: string = "intermediate",
  type: string = "mixed"
) {
  const domainKey = domain.toLowerCase();

  if (
    domainKey.includes("technical") ||
    domainKey.includes("developer") ||
    domainKey.includes("engineer")
  ) {
    const levelKey = level.includes("senior")
      ? "senior"
      : level.includes("junior") || level.includes("entry")
      ? "beginner"
      : "intermediate";
    const typeKey = type === "behavioral" ? "behavioral" : "technical";
    return (
      domainQuestionBanks.technical[levelKey]?.[typeKey] ||
      domainQuestionBanks.technical.intermediate.technical
    );
  }

  // Handle other domains
  if (domainKey.includes("sales")) return domainQuestionBanks.sales.questions;
  if (domainKey.includes("analytics") || domainKey.includes("data"))
    return domainQuestionBanks.analytics.questions;
  if (domainKey.includes("marketing"))
    return domainQuestionBanks.marketing.questions;
  if (domainKey.includes("hr") || domainKey.includes("human"))
    return domainQuestionBanks.hr.questions;
  if (domainKey.includes("finance") || domainKey.includes("accounting"))
    return domainQuestionBanks.finance.questions;

  // Default fallback
  return domainQuestionBanks.technical.intermediate.technical;
}
