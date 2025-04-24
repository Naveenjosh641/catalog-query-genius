
import { Assessment } from "@/components/AssessmentResults";
import { assessments } from "@/data/assessments";

// Simple vector representation of a text (TF-IDF like approach)
interface TextVector {
  [key: string]: number;
}

// Convert text to a simple vector representation
const textToVector = (text: string): TextVector => {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const vector: TextVector = {};
  
  words.forEach(word => {
    // Skip very common words (stopwords)
    if (isStopword(word)) return;
    
    if (!vector[word]) {
      vector[word] = 0;
    }
    vector[word] += 1;
  });
  
  return vector;
};

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vector1: TextVector, vector2: TextVector): number => {
  const keys1 = Object.keys(vector1);
  const keys2 = Object.keys(vector2);
  
  // Calculate dot product
  let dotProduct = 0;
  keys1.forEach(key => {
    if (vector2[key]) {
      dotProduct += vector1[key] * vector2[key];
    }
  });
  
  // Calculate magnitudes
  const magnitude1 = Math.sqrt(keys1.reduce((sum, key) => sum + vector1[key] * vector1[key], 0));
  const magnitude2 = Math.sqrt(keys2.reduce((sum, key) => sum + vector2[key] * vector2[key], 0));
  
  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return dotProduct / (magnitude1 * magnitude2);
};

// Simple stopwords list
const stopwords = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 
  'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'against', 'between',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 
  'down', 'of', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now'
]);

const isStopword = (word: string): boolean => {
  return stopwords.has(word.toLowerCase());
};

// Create content vectors for each assessment
const createAssessmentVectors = (): Map<string, TextVector> => {
  const assessmentVectors = new Map<string, TextVector>();
  
  assessments.forEach(assessment => {
    // Create a rich text representation of the assessment
    const assessmentText = `
      ${assessment.name} 
      ${assessment.testType} 
      ${assessment.duration} 
      ${assessment.remoteTesting ? 'remote testing' : ''}
      ${assessment.adaptiveSupport ? 'adaptive support' : ''}
      ${assessment.iirtSupport ? 'iirt support' : ''}
    `;
    
    assessmentVectors.set(assessment.id, textToVector(assessmentText));
  });
  
  return assessmentVectors;
};

// Calculate keyword importance using techniques like TF-IDF
const enhanceQuery = (query: string): string => {
  // This is a simplified version, in a real implementation you would use
  // more sophisticated NLP techniques like NER, keyword extraction, etc.
  
  // Add synonyms for technical terms
  let enhancedQuery = query;
  
  // Add context for job roles and skills
  if (query.toLowerCase().includes('java')) {
    enhancedQuery += ' programming development coding software engineer developer';
  }
  
  if (query.toLowerCase().includes('python')) {
    enhancedQuery += ' programming development coding software engineer developer data science machine learning';
  }
  
  if (query.toLowerCase().includes('analyst') || query.toLowerCase().includes('analysis')) {
    enhancedQuery += ' business data reporting analytics requirements';
  }
  
  if (query.toLowerCase().includes('ui') || query.toLowerCase().includes('front') || 
      query.toLowerCase().includes('screen')) {
    enhancedQuery += ' user interface design frontend web development UI UX';
  }
  
  if (query.toLowerCase().includes('cognitive') || query.toLowerCase().includes('personality')) {
    enhancedQuery += ' psychological assessment test aptitude behavior traits thinking';
  }
  
  return enhancedQuery;
};

// Our main RAG search function
export const searchAssessments = async (query: string, isUrl: boolean): Promise<Assessment[]> => {
  // In a real implementation, we would:
  // 1. Fetch content from URL if isUrl is true
  // 2. Process query with a real embedding model
  // 3. Use a vector database for similarity search
  // 4. Implement proper ranking algorithms
  
  // For this demo, we'll use a simplified vector approach
  let processedQuery = query;
  
  // Simulate fetching from URL (in real implementation, we'd actually fetch the content)
  if (isUrl) {
    console.log("Would fetch content from URL:", query);
    processedQuery = "Java developer with excellent communication skills and team collaboration";
  }
  
  // Enhance query with related terms and context
  const enhancedQuery = enhanceQuery(processedQuery);
  
  // Convert query to vector representation
  const queryVector = textToVector(enhancedQuery);
  
  // Get pre-computed assessment vectors
  const assessmentVectors = createAssessmentVectors();
  
  // Calculate similarity scores
  const scoredAssessments = assessments.map(assessment => {
    const assessmentVector = assessmentVectors.get(assessment.id);
    const score = assessmentVector ? cosineSimilarity(queryVector, assessmentVector) : 0;
    
    return {
      ...assessment,
      score
    };
  });
  
  // Sort by similarity score
  scoredAssessments.sort((a, b) => (b.score || 0) - (a.score || 0));
  
  // Return top 10 results (or fewer if there aren't that many good matches)
  const topResults = scoredAssessments
    .filter(assessment => (assessment.score || 0) > 0.1)
    .slice(0, 10);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return topResults;
};

// Function to make this accessible via API
export const searchAssessmentsAPI = async (query: string, isUrl: boolean): Promise<{
  query: string;
  isUrl: boolean;
  results: Assessment[];
}> => {
  const results = await searchAssessments(query, isUrl);
  
  return {
    query,
    isUrl,
    results
  };
};
