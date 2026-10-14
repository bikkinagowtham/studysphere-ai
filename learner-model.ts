import {
  LearnerProfileModel,
  TopicMastery,
  QuizAttemptAnswer,
  Flashcard
} from '@/types';
import { readDatabase, writeDatabase } from '@/lib/db';

export interface BKTParameters {
  pL0: number; // Initial prior probability of mastery (default: 0.3)
  pT: number;  // Probability of learning transition (default: 0.15)
  pG: number;  // Probability of guessing (default: 0.20 for 4-option MCQ)
  pS: number;  // Probability of slipping (default: 0.10)
}

const DEFAULT_BKT_PARAMS: BKTParameters = {
  pL0: 0.30,
  pT: 0.15,
  pG: 0.20,
  pS: 0.10,
};

export const PREREQUISITE_DEPENDENCY_GRAPH: Record<string, { prerequisites: string[]; description: string }> = {
  'Calculus Chain Rule': {
    prerequisites: [],
    description: 'Derivative rules and composite functions differentiation.'
  },
  'Linear Algebra': {
    prerequisites: [],
    description: 'Matrix multiplication, vectors, and dot products.'
  },
  'Gradient Descent': {
    prerequisites: ['Calculus Chain Rule'],
    description: 'First-order iterative optimization algorithm for finding a local minimum.'
  },
  'Backpropagation': {
    prerequisites: ['Calculus Chain Rule', 'Linear Algebra', 'Gradient Descent'],
    description: 'Reverse-mode automatic differentiation through computational graphs.'
  },
  'Activation Functions': {
    prerequisites: ['Backpropagation'],
    description: 'Non-linear transformations (Sigmoid, Tanh, ReLU) and saturation behavior.'
  },
  'Computer Architecture': {
    prerequisites: [],
    description: 'Registers, ALU, caches, and memory bus.'
  },
  'Memory Addressing': {
    prerequisites: ['Computer Architecture'],
    description: 'Logical addresses, physical addresses, offsets and base registers.'
  },
  'Virtual Memory': {
    prerequisites: ['Memory Addressing'],
    description: 'Paging mechanisms, page tables, page faults, and swap space.'
  },
  'TLB': {
    prerequisites: ['Virtual Memory'],
    description: 'Translation Lookaside Buffer associative cache hit/miss latency.'
  },
  'Lagrange Multipliers': {
    prerequisites: ['Calculus Chain Rule'],
    description: 'Constrained multi-variable extrema via gradient collinearity.'
  }
};

export class LearnerModelService {
  /**
   * Update topic mastery using Bayesian Knowledge Tracing (BKT)
   */
  public static updateTopicMasteryWithBKT(
    currentMastery: number,
    isCorrect: boolean,
    customParams?: Partial<BKTParameters>
  ): number {
    const params: BKTParameters = { ...DEFAULT_BKT_PARAMS, ...customParams };
    const pL_prev = Math.max(0.01, Math.min(0.99, currentMastery));

    // Posterior observation probability
    let pL_obs: number;
    if (isCorrect) {
      const numerator = pL_prev * (1 - params.pS);
      const denominator = numerator + (1 - pL_prev) * params.pG;
      pL_obs = numerator / (denominator || 1);
    } else {
      const numerator = pL_prev * params.pS;
      const denominator = numerator + (1 - pL_prev) * (1 - params.pG);
      pL_obs = numerator / (denominator || 1);
    }

    // Knowledge transition update
    const pL_next = pL_obs + (1 - pL_obs) * params.pT;
    return Math.round(Math.max(0.05, Math.min(0.98, pL_next)) * 100) / 100;
  }

  /**
   * Get or initialize a learner profile
   */
  public static getLearnerProfile(userId: string): LearnerProfileModel {
    const db = readDatabase();
    if (db.learnerProfiles[userId]) {
      return db.learnerProfiles[userId];
    }

    // Default initial profile for new learner
    const initialProfile: LearnerProfileModel = {
      userId,
      overallMastery: 0.35,
      studyStreakDays: 1,
      totalStudyHours: 0.5,
      nextRecommendedTopic: 'Neural Networks',
      nextRecommendedActivity: 'diagnostic',
      topicMasteries: {}
    };

    // Initialize topics from known dependencies
    Object.keys(PREREQUISITE_DEPENDENCY_GRAPH).forEach(t => {
      initialProfile.topicMasteries[t] = {
        topic: t,
        masteryProbability: 0.30,
        totalAttempts: 0,
        correctAttempts: 0,
        lastPracticed: new Date().toISOString(),
        trend: 'stable',
        prerequisites: PREREQUISITE_DEPENDENCY_GRAPH[t].prerequisites
      };
    });

    db.learnerProfiles[userId] = initialProfile;
    writeDatabase(db);
    return initialProfile;
  }

  /**
   * Process quiz results and update learner mastery
   */
  public static recordQuizAttempt(
    userId: string,
    topic: string,
    answers: QuizAttemptAnswer[]
  ): LearnerProfileModel {
    const db = readDatabase();
    const profile = this.getLearnerProfile(userId);

    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalCount = answers.length;

    let currentMastery = profile.topicMasteries[topic]?.masteryProbability ?? DEFAULT_BKT_PARAMS.pL0;

    // Apply BKT sequentially for each question attempt
    answers.forEach(ans => {
      currentMastery = this.updateTopicMasteryWithBKT(currentMastery, ans.isCorrect);
    });

    const prevMastery = profile.topicMasteries[topic]?.masteryProbability ?? 0.3;
    const trend = currentMastery > prevMastery ? 'improving' : currentMastery < prevMastery ? 'needs_attention' : 'stable';

    profile.topicMasteries[topic] = {
      topic,
      masteryProbability: currentMastery,
      totalAttempts: (profile.topicMasteries[topic]?.totalAttempts || 0) + totalCount,
      correctAttempts: (profile.topicMasteries[topic]?.correctAttempts || 0) + correctCount,
      lastPracticed: new Date().toISOString(),
      trend,
      prerequisites: PREREQUISITE_DEPENDENCY_GRAPH[topic]?.prerequisites || []
    };

    // Recompute overall mastery as mean of active topics
    const activeMasteries = Object.values(profile.topicMasteries).filter(m => m.totalAttempts > 0);
    if (activeMasteries.length > 0) {
      const sum = activeMasteries.reduce((acc, m) => acc + m.masteryProbability, 0);
      profile.overallMastery = Math.round((sum / activeMasteries.length) * 100) / 100;
    }

    // Adaptive recommendation determination
    const recommendation = this.computeAdaptiveRecommendation(profile);
    profile.nextRecommendedTopic = recommendation.recommendedTopic;
    profile.nextRecommendedActivity = recommendation.recommendedActivity;

    db.learnerProfiles[userId] = profile;
    writeDatabase(db);

    return profile;
  }

  /**
   * Recommend next learning activity based on mastery, prerequisites, and recency
   */
  public static computeAdaptiveRecommendation(profile: LearnerProfileModel): {
    recommendedTopic: string;
    recommendedActivity: 'diagnostic' | 'flashcards' | 'topic_quiz' | 'mock_exam' | 'deep_dive_tutor';
    rationale: string;
  } {
    const topics = Object.values(profile.topicMasteries);
    
    // Check for weak topics (< 0.50) where prerequisites are mastered (> 0.70)
    for (const item of topics) {
      if (item.masteryProbability < 0.50) {
        const prereqsMastered = item.prerequisites.every(p => {
          const pMastery = profile.topicMasteries[p]?.masteryProbability ?? 0.3;
          return pMastery >= 0.65;
        });

        if (prereqsMastered) {
          return {
            recommendedTopic: item.topic,
            recommendedActivity: 'deep_dive_tutor',
            rationale: `Prerequisites for "${item.topic}" are solid, but current mastery is ${Math.round(item.masteryProbability * 100)}%. Deep-dive tutor explanation recommended.`
          };
        }
      }
    }

    // Check for topics needing quiz practice (between 0.50 and 0.75)
    const practiceNeeded = topics.find(t => t.masteryProbability >= 0.50 && t.masteryProbability < 0.75);
    if (practiceNeeded) {
      return {
        recommendedTopic: practiceNeeded.topic,
        recommendedActivity: 'topic_quiz',
        rationale: `Mastery in "${practiceNeeded.topic}" is moderate (${Math.round(practiceNeeded.masteryProbability * 100)}%). A 3-question adaptive quiz will reinforce retention.`
      };
    }

    // High overall mastery -> Mock exam
    if (profile.overallMastery >= 0.75) {
      return {
        recommendedTopic: 'Comprehensive Finals',
        recommendedActivity: 'mock_exam',
        rationale: 'Overall mastery exceeds 75%. Time for a full-length timed mock examination.'
      };
    }

    return {
      recommendedTopic: 'Backpropagation',
      recommendedActivity: 'flashcards',
      rationale: 'Review key formulas and conceptual definitions via spaced repetition flashcards.'
    };
  }

  /**
   * Spaced Repetition (SM-2) Flashcard Update
   * Quality rating q: 0 to 5
   */
  public static updateFlashcardSM2(card: Flashcard, quality: number): Flashcard {
    const q = Math.max(0, Math.min(5, quality));
    let { repetitionCount, easinessFactor, intervalDays } = card;

    if (q >= 3) {
      if (repetitionCount === 0) {
        intervalDays = 1;
      } else if (repetitionCount === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(intervalDays * easinessFactor);
      }
      repetitionCount += 1;
    } else {
      repetitionCount = 0;
      intervalDays = 1;
    }

    // Update Easiness Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easinessFactor = easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easinessFactor < 1.3) easinessFactor = 1.3;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalDays);

    return {
      ...card,
      repetitionCount,
      easinessFactor: Math.round(easinessFactor * 100) / 100,
      intervalDays,
      nextReviewDate: nextDate.toISOString()
    };
  }
}
