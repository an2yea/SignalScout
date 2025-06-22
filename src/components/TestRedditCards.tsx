import React from 'react';
import { RedditPostCards, type RedditPostResult } from './RedditPostCards';

// Sample data from the test_data.json file
const sampleRedditPosts: RedditPostResult[] = [
  {
    "postId": "1lfx5mc",
    "postUrl": "https://reddit.com/r/LangChain/comments/1lfx5mc/what_should_i_build_next_looking_for_ideas_for_my/",
    "postTitle": "What should I build next? Looking for ideas for my Awesome AI Apps repo!",
    "author": "Arindam_200",
    "fitScore": "high" as const,
    "who": "unknown",
    "matched_signals": [
      "Posts mentioning 'LangChain'",
      "Posts mentioning 'CrewAI'"
    ],
    "rationale": [
      "Focus on practical examples for LLMs and agentic workflows aligns with our ICP.",
      "Mention of multiple agentic frameworks, including LangChain and CrewAI, directly ties to our ideal customer profile.",
      "Collaborative approach and problem-solving for real applications indicate a strong engagement with our target market."
    ],
    "comment": "Hey Arindam! Have you thought about building a middleware solution to streamline interactions between different agentic frameworks? It could make it easier for users to experiment with multiple setups without diving deep into each one. Also, if you ever need an integrated way to manage OAuth and tokens for these agents, I found that useful in our projects."
  },
  {
    "postId": "1lcssom",
    "postUrl": "https://reddit.com/r/LangChain/comments/1lcssom/we_built_a_github_repo_understanding_agent_in/",
    "postTitle": "We built a GitHub Repo Understanding Agent in Just 300 lines of code!!",
    "author": "AdVirtual2648",
    "fitScore": "high" as const,
    "who": "unknown",
    "matched_signals": [
      "Posts mentioning \"LangChain\"",
      "Case-study style interest: \"saved X engineering hours\"",
      "build vs buy integrations",
      "Urgency cues: hackathon, MVP, TechCrunch Disrupt demo (e.g., Fabrile's 30-min integration)"
    ],
    "rationale": [
      "The post discusses integrating AI for enhanced agent functionality which aligns with LLM features.",
      "The author expresses challenges and validates a solution to improve efficiency, indicating awareness of integration pain points.",
      "The project is modular and suggests use in multi-agent systems, fitting well with Composio's ICP focus."
    ],
    "comment": "Hey, I love the idea behind your agent! One tip I found helpful when analyzing repos is to prioritize parsing the most commonly used files first, like README.md. This gives you quick insights before diving deep into other files and can save a lot of time in onboarding."
  }
];

export const TestRedditCards: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            🧪 Reddit Post Cards Test
          </h1>
          <p className="text-gray-400">
            Testing the Reddit post cards component with sample data
          </p>
        </div>
        
        <RedditPostCards posts={sampleRedditPosts} onDownload={() => {}} />
      </div>
    </div>
  );
}; 