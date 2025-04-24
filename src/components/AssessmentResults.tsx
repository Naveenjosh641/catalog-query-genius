
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

export interface Assessment {
  id: string;
  name: string;
  url: string;
  remoteTesting: boolean;
  adaptiveSupport: boolean;
  iirtSupport: boolean;
  duration: string;
  testType: string;
  score?: number; // Relevance score
}

interface AssessmentResultsProps {
  assessments: Assessment[];
  query: string;
  isLoading: boolean;
}

const AssessmentResults = ({ assessments, query, isLoading }: AssessmentResultsProps) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full bg-muted/50 animate-pulse h-48">
            <CardContent className="p-6"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (assessments.length === 0 && query) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 text-center">
        <h3 className="text-xl font-semibold text-gray-700">No matching assessments found</h3>
        <p className="text-gray-500 mt-2">Try refining your search query or using different keywords</p>
      </div>
    );
  }

  if (assessments.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800">
        Found {assessments.length} Recommended Assessment{assessments.length !== 1 ? 's' : ''}
      </h2>
      
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="w-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-semibold text-shl-blue">
                  {assessment.name}
                </CardTitle>
                {assessment.score !== undefined && (
                  <Badge variant="outline" className="text-shl-blue border-shl-blue">
                    Score: {Math.round(assessment.score * 100)}%
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm text-gray-600">
                {assessment.testType} • {assessment.duration}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant={assessment.remoteTesting ? "default" : "outline"} className={assessment.remoteTesting ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                    Remote Testing: {assessment.remoteTesting ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={assessment.adaptiveSupport ? "default" : "outline"} className={assessment.adaptiveSupport ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}>
                    Adaptive: {assessment.adaptiveSupport ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={assessment.iirtSupport ? "default" : "outline"} className={assessment.iirtSupport ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : ""}>
                    IIRT Support: {assessment.iirtSupport ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </CardContent>
            
            <Separator />
            
            <CardFooter className="pt-3 flex justify-between">
              <a 
                href={assessment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-shl-blue hover:text-shl-lightblue flex items-center gap-1"
              >
                View details <ExternalLink size={14} />
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssessmentResults;
