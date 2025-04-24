
import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import AssessmentResults from "@/components/AssessmentResults";
import { Assessment } from "@/components/AssessmentResults";
import { searchAssessments } from "@/services/ragService";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Assessment[]>([]);

  const handleSearch = async (searchQuery: string, isUrl: boolean) => {
    setIsLoading(true);
    setQuery(searchQuery);
    
    try {
      const searchResults = await searchAssessments(searchQuery, isUrl);
      setResults(searchResults);
    } catch (error) {
      console.error("Error searching assessments:", error);
      // In a real app, we would show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-shl-blue">SHL Assessment Finder</h1>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => window.open("/api/search", "_blank")}
                className="text-sm"
              >
                API Docs
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open("https://github.com/yourusername/catalog-query-genius", "_blank")}
                className="text-sm"
              >
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Find the Perfect Assessments for Your Hiring Needs
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Enter a natural language description of the role you're hiring for, and we'll recommend the most relevant SHL assessments.
          </p>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
        
        <AssessmentResults assessments={results} query={query} isLoading={isLoading} />
        
        {results.length > 0 && (
          <div className="w-full max-w-4xl mx-auto mt-8 text-center">
            <p className="text-sm text-gray-500">
              These recommendations are powered by our Retrieval-Augmented Generation (RAG) system.
            </p>
          </div>
        )}

        {!query && (
          <div className="w-full max-w-3xl mx-auto mt-16 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Try These Example Queries:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="hover:bg-gray-50 p-2 rounded cursor-pointer" onClick={() => handleSearch("I am hiring for Java developers who can collaborate effectively with my business teams", false)}>
                "I am hiring for Java developers who can collaborate effectively with my business teams"
              </li>
              <li className="hover:bg-gray-50 p-2 rounded cursor-pointer" onClick={() => handleSearch("Looking to hire mid-level professionals who are proficient in Python, SQL and Java Script", false)}>
                "Looking to hire mid-level professionals who are proficient in Python, SQL and Java Script"
              </li>
              <li className="hover:bg-gray-50 p-2 rounded cursor-pointer" onClick={() => handleSearch("I need a UI test that can help me screen applications. Time limit is less than 30 minutes", false)}>
                "I need a UI test that can help me screen applications. Time limit is less than 30 minutes"
              </li>
              <li className="hover:bg-gray-50 p-2 rounded cursor-pointer" onClick={() => handleSearch("I am hiring for an analyst and want applications to screen using Cognitive and personality tests", false)}>
                "I am hiring for an analyst and want applications to screen using Cognitive and personality tests"
              </li>
            </ul>
          </div>
        )}
      </main>
      
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 SHL Assessment Finder. All rights reserved.</p>
          <p className="mt-2">A Retrieval-Augmented Generation (RAG) demonstration project.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="/api/search" className="text-shl-blue hover:text-shl-lightblue">API Documentation</a>
            <span>|</span>
            <a href="https://github.com/yourusername/catalog-query-genius" className="text-shl-blue hover:text-shl-lightblue">GitHub Repository</a>
            <span>|</span>
            <a href="https://www.shl.com/solutions/products/product-catalog/" className="text-shl-blue hover:text-shl-lightblue">SHL Product Catalog</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
