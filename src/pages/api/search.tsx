
import React from "react";
import { searchAssessmentsAPI } from "@/services/ragService";

interface ApiSearchProps {
  query?: string;
  url?: string;
}

// This component serves as a frontend representation of our API
// In a real application, this would be a server-side API endpoint
// For this demo, we'll simulate it client-side
const ApiSearch = ({ query, url }: ApiSearchProps) => {
  const [result, setResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (!query && !url) {
        setResult({ message: "Please provide 'query' or 'url' parameter" });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchQuery = query || url || "";
        const isUrl = !!url;
        const results = await searchAssessmentsAPI(searchQuery, isUrl);
        setResult(results);
      } catch (err) {
        setError("Error processing request");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, url]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-gray-100 p-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Assessment Search API</h1>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Request</h2>
          <pre className="bg-gray-200 p-3 rounded text-sm">
            {JSON.stringify({ query, url }, null, 2)}
          </pre>
        </div>

        {loading && <div className="text-center my-4">Loading results...</div>}
        
        {error && (
          <div className="mb-4 bg-red-100 text-red-800 p-3 rounded">
            Error: {error}
          </div>
        )}
        
        {result && !loading && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Response</h2>
            <pre className="bg-gray-200 p-3 rounded overflow-auto text-sm" style={{ maxHeight: "400px" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h2 className="text-lg font-semibold">API Documentation</h2>
          <p className="mb-2">
            This API accepts GET requests with the following parameters:
          </p>
          <ul className="list-disc list-inside mb-2">
            <li><code>query</code>: Natural language description of the job role</li>
            <li><code>url</code>: URL to a job description (optional)</li>
          </ul>
          <p className="mb-2">
            Example usage:
          </p>
          <pre className="bg-gray-200 p-2 rounded text-sm">
            /api/search?query=Java developers with team collaboration skills
          </pre>
          <p className="mt-2 text-sm text-gray-600">
            Note: In a production environment, this would be a proper REST API endpoint.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiSearch;
