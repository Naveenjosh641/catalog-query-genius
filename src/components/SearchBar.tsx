
import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SearchBarProps {
  onSearch: (query: string, isUrl: boolean) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [activeTab, setActiveTab] = useState<string>("query");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchUrl, setSearchUrl] = useState<string>("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (activeTab === "query" && searchQuery.trim()) {
      onSearch(searchQuery.trim(), false);
    } else if (activeTab === "url" && searchUrl.trim()) {
      onSearch(searchUrl.trim(), true);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs defaultValue="query" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="query">Natural Language Query</TabsTrigger>
          <TabsTrigger value="url">Job Description URL</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSearch} className="space-y-4">
          <TabsContent value="query" className="space-y-4">
            <Textarea
              placeholder="Describe the role or skills you're hiring for (e.g., 'I am hiring for Java developers who can collaborate effectively with business teams')"
              className="min-h-[120px] p-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <Input
              type="url"
              placeholder="Enter job description URL"
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
            />
          </TabsContent>

          <Button 
            type="submit" 
            disabled={isLoading || ((activeTab === "query" && !searchQuery.trim()) || (activeTab === "url" && !searchUrl.trim()))}
            className="w-full bg-shl-blue hover:bg-shl-lightblue text-white"
          >
            {isLoading ? "Searching..." : "Find Assessments"}
          </Button>
        </form>
      </Tabs>
    </div>
  );
};

export default SearchBar;
