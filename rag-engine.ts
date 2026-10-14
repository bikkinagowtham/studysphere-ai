import { DocumentChunk, SourceMetadata } from '@/types';
import { readDatabase } from '@/lib/db';

export interface SearchResult {
  chunk: DocumentChunk;
  similarityScore: number;
}

export class RAGEngine {
  // Tokenize and build frequency vector
  private static tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  }

  private static computeTF(tokens: string[]): Record<string, number> {
    const tf: Record<string, number> = {};
    for (const token of tokens) {
      tf[token] = (tf[token] || 0) + 1;
    }
    const len = tokens.length || 1;
    for (const token in tf) {
      tf[token] = tf[token] / len;
    }
    return tf;
  }

  // Cosine similarity between two TF vectors
  private static cosineSimilarity(tfA: Record<string, number>, tfB: Record<string, number>): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const key in tfA) {
      normA += tfA[key] * tfA[key];
      if (tfB[key]) {
        dotProduct += tfA[key] * tfB[key];
      }
    }

    for (const key in tfB) {
      normB += tfB[key] * tfB[key];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Retrieve relevant chunks from the student's indexed knowledge base
   */
  public static retrieveRelevantChunks(query: string, docIds?: string[], topK: number = 3): SearchResult[] {
    const db = readDatabase();
    let eligibleChunks = db.chunks;

    if (docIds && docIds.length > 0) {
      eligibleChunks = eligibleChunks.filter(c => docIds.includes(c.docId));
    }

    if (eligibleChunks.length === 0) {
      return [];
    }

    const queryTokens = this.tokenize(query);
    const queryTF = this.computeTF(queryTokens);

    const scored = eligibleChunks.map(chunk => {
      // Chunk content TF
      const chunkTokens = this.tokenize(chunk.content + ' ' + chunk.topic + ' ' + (chunk.subtopic || ''));
      const chunkTF = this.computeTF(chunkTokens);

      let score = this.cosineSimilarity(queryTF, chunkTF);

      // Topic boost
      const queryLower = query.toLowerCase();
      if (queryLower.includes(chunk.topic.toLowerCase())) {
        score += 0.35;
      }
      if (chunk.subtopic && queryLower.includes(chunk.subtopic.toLowerCase())) {
        score += 0.25;
      }

      // Keyword overlap boost
      const intersection = queryTokens.filter(t => chunkTokens.includes(t));
      if (intersection.length > 0) {
        score += (intersection.length / queryTokens.length) * 0.2;
      }

      return {
        chunk,
        similarityScore: Math.min(1.0, score)
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.similarityScore - a.similarityScore);

    // Filter by relevance threshold
    const filtered = scored.filter(s => s.similarityScore > 0.08);

    return filtered.slice(0, topK);
  }

  /**
   * Check if query is likely out-of-scope (adversarial or not covered in materials)
   */
  public static isQueryOutOfScope(query: string, retrievedResults: SearchResult[]): boolean {
    if (retrievedResults.length === 0) return true;
    const topScore = retrievedResults[0].similarityScore;
    return topScore < 0.12;
  }
}
