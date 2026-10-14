# StudySphere AI — Hackathon Demonstration Video Script
**Multimodal AI Hackathon 2026 • Track D: Personalized Tutoring & Adaptive Learning**  
**Target Duration:** 5 – 7 Minutes  
**Presenter:** Full-Stack Lead / AI Engineer

---

## [0:00 – 0:45] Act 1: The Problem & The Product Vision
**Visual:** Screen recording starts on the StudySphere AI landing page (`http://localhost:3000`). The interactive 3D Globe spins gently with glowing neural connections between continents. Floating PDF, slide deck, and video badges hover in the hero section.

**Speaker (Voiceover):**  
"Hello judges and fellow builders! In traditional online learning, students struggle with two major hurdles:  
1. Generative AI tools often hallucinate non-existent citations, making them untrustworthy for exam prep.  
2. Quizzes are static, one-size-fits-all, and disconnected from individual cognitive gaps.

Today, we are thrilled to present **StudySphere AI — Your Personal AI Study Companion**, built specifically for Track D: Personalized Tutoring & Adaptive Learning.  
Our platform turns any multimodal study resource—textbooks, slide decks, and lecture videos—into source-grounded tutoring, mathematically verified quizzes, and explainable Bayesian knowledge tracing."

---

## [0:45 – 1:45] Act 2: Multimodal Ingestion & Source Provenance
**Visual:** Navigate to `/upload`. Click on the fast-track template *"Database Systems: Concurrency Control & ACID"*. Click *"Ingest & Index Resource"*. Watch the 4-stage pipeline run: Validation → Structure & OCR → Metadata Chunks → Topic Indexing. Then transition to `/library`.

**Speaker (Voiceover):**  
"Let’s see the core hackathon engine in action. In the Knowledge Base, students can upload PDF chapters, PPTX slide decks, or timestamped lecture transcripts.  
When we ingest a document, StudySphere parses structural headings, preserves exact page numbers, slide numbers, or video timestamps, and splits the content into source-anchored semantic chunks.  
Notice how in our library, every resource preserves its exact chunk count and topic tags—ready for vector search with zero hallucination."

---

## [1:45 – 3:15] Act 3: Source-Grounded AI Tutor & Clickable Citations
**Visual:** Navigate to `/tutor`. Type the query:  
*"Why does ReLU prevent vanishing gradients compared to Sigmoid?"*  
The tutor streams an answer. Hover over the citation badge `[Source: Page 7, Sec 3.4]`. Click it to trigger the **Source Citation Drawer**.

**Speaker (Voiceover):**  
"Now let’s open our AI Tutor. Here we ask a deep technical question about gradient descent.  
Notice what makes StudySphere world-class:  
First, every factual explanation is strictly derived from the student's uploaded material.  
Second, look at this clickable citation tag. When we click it, the **Source Citation Drawer** slides in, revealing the verbatim excerpt directly from Page 7, Section 3.4 of our uploaded textbook!  
Third, we can switch between **Beginner** mode for intuitive mental analogies, **Intermediate** mode for conceptual definitions, and **Advanced** mode for formal mathematical derivations.  
And with our multilingual architecture, students can switch to Telugu (తెలుగు) or Hindi (हिन्दी) on the fly without losing technical precision."

---

## [3:15 – 4:30] Act 4: Adaptive Quizzes & Deterministic Verification
**Visual:** Navigate to `/quizzes`. Select *Backpropagation*, difficulty *Medium*, question count *3*. Click *"Start Assessment"*. Proceed to answer the questions on `/assessment/[id]`. Submit the test. Confetti triggers! View the Post-Assessment Report with Misconception Analysis.

**Speaker (Voiceover):**  
"Now to test mastery. In the Adaptive Assessment engine, StudySphere synthesizes questions directly from our verified chunks.  
Numerical problems undergo deterministic mathematical verification, while multiple-choice items are verified before presentation.  
When the student submits their test, our engine doesn't just show a raw score—it generates an actionable diagnostic report highlighting specific misconceptions, complete with source citations and recommended next steps."

---

## [4:30 – 5:45] Act 5: Bayesian Knowledge Tracing & Spaced Repetition
**Visual:** Navigate to `/progress`. Show the **Topic Mastery Estimates** cards. Switch to the **Prerequisite DAG** tab. Switch to **Spaced Flashcards (SM-2)** and click to flip a card and rate retrieval quality.

**Speaker (Voiceover):**  
"Behind every recommendation is our explainable **Bayesian Knowledge Tracing (BKT)** model.  
Instead of guessing, the platform computes dynamic mastery probabilities $p(L_t)$ factoring in slip probabilities, guess odds, and learning transition rates after each attempt.  
Our prerequisite dependency graph ensures that students master foundational concepts—like Calculus and Linear Algebra—before tackling downstream topics.  
And with SuperMemo SM-2 spaced repetition, flashcard intervals adjust automatically to guarantee retention before exam day."

---

## [5:45 – 6:30] Act 6: Honest Analytics & Hackathon Scoring
**Visual:** Navigate to `/analytics`. Show the real database record counters. Toggle between Real Production Records and Simulated Demo Mode. Scroll to the Track D Evaluation Benchmark and click *"Run Evaluation Pipeline Now"*. The benchmark results update with 96% Faithfulness and +95% Learner Gain.

**Speaker (Voiceover):**  
"Finally, in our Analytics & Evaluation dashboard, we believe in radical honesty. All platform counters reflect actual database records—we never fabricate 10,000 fake users. For presentations, we provide a clearly labeled demo mode.  
And aligned directly with Track D hackathon scoring, our automated benchmark evaluates Faithfulness, Answer Relevance, Context Precision, and Citation Accuracy against ground-truth test sets.

StudySphere AI is fully functional, secure, multilingual, and ready for production deployment. Thank you!"
