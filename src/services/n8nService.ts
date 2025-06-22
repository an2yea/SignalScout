import { RedditSignals } from './redditSignalService';

/**
 * Extract keywords from Reddit signals for n8n payload
 */
function extractKeywordsFromSignals(redditSignals: RedditSignals): string {
  const allKeywords: string[] = [];
  
  // Extract keywords from keyword clusters
  if (redditSignals.keyword_clusters && Array.isArray(redditSignals.keyword_clusters)) {
    redditSignals.keyword_clusters.forEach(cluster => {
      if (cluster.keywords) {
        const keywords = cluster.keywords.split('; ').map(k => k.trim());
        allKeywords.push(...keywords);
      }
    });
  }
  
  // Create boolean search query from keywords
  if (allKeywords.length > 0) {
    const quotedKeywords = allKeywords.map(keyword => `"${keyword}"`);
    return `(${quotedKeywords.join(' OR ')})`;
  }
  
  // Fallback to boolean search query if available
  return redditSignals.boolean_search_query || '';
}

/**
 * Extract subreddit names from Reddit signals
 */
function extractSubredditsFromSignals(redditSignals: RedditSignals): string {
  if (redditSignals.subreddits && Array.isArray(redditSignals.subreddits)) {
    const subredditNames = redditSignals.subreddits.map(sub => {
      // Remove 'r/' prefix if present
      return sub.name.replace(/^r\//, '');
    });
    return `https://oauth.reddit.com/r/${subredditNames.join('+')}/search`;
  }
  
  // Fallback to reddit_search_url if available
  return redditSignals.reddit_search_url || '';
}

/**
 * Download n8n response as JSON file
 */
export function downloadN8nResponse(responseData: string, url: string): void {
  const hostname = new URL(url).hostname;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `n8n_reddit_results_${hostname.replace(/\./g, '_')}_${timestamp}.json`;
  
  // Try to parse the response as JSON for better formatting
  let formattedData: string;
  try {
    const parsed = JSON.parse(responseData);
    formattedData = JSON.stringify(parsed, null, 2);
  } catch {
    // If not JSON, use as-is
    formattedData = responseData;
  }
  
  const dataBlob = new Blob([formattedData], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename;
  link.click();
  
  // Clean up
  URL.revokeObjectURL(link.href);
}

/**
 * Trigger n8n Reddit search workflow with dynamic data from Reddit signals
 */
export async function triggerN8nWorkflow(redditSignals?: RedditSignals): Promise<{ message: string; response: string; payload: any }> {
  const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  let keywords: string;
  let subcommunities: string;

  if (redditSignals) {
    // Use dynamic data from Reddit signals
    keywords = extractKeywordsFromSignals(redditSignals);
    subcommunities = extractSubredditsFromSignals(redditSignals);
    
    console.log('🎯 Using dynamic Reddit signals data');
    console.log('📊 Reddit Signals Input:', {
      subreddits: redditSignals.subreddits?.map(s => s.name),
      keyword_clusters_count: redditSignals.keyword_clusters?.length || 0,
      has_boolean_query: !!redditSignals.boolean_search_query,
      has_search_url: !!redditSignals.reddit_search_url
    });
  } else {
    // Fallback to hardcoded values if no Reddit signals provided
    const subreddits = ['LangChain', 'crewai', 'AI_Agents'];
    subcommunities = `https://oauth.reddit.com/r/${subreddits.join('+')}/search`;
    keywords = `("stuck" OR "blocked" OR "frustrated" OR "hate" OR "nightmare" OR "pulling my hair" OR "hours wasted" OR "flaky integration") AND ("langchain" OR "crewai" OR "llamaindex" OR "function calling" OR "oauth" OR "token refresh" OR "integration")`;
    
    console.log('⚠️ Using fallback hardcoded data (no Reddit signals available)');
  }

  const payload = {
    keywords: keywords,
    subcommunities: subcommunities,
  };

  // Enhanced console logging
  console.log('🚀 Triggering n8n workflow');
  console.log('📤 Payload being sent to n8n:');
  console.log('   Keywords:', payload.keywords);
  console.log('   Subcommunities:', payload.subcommunities);
  console.log('   Webhook URL:', n8nWebhookUrl);
  console.log('   Full Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ n8n webhook failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`n8n webhook failed with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.text();
    console.log('✅ n8n workflow triggered successfully');
    console.log('📥 Response from n8n:', responseData);
    
    // Try to parse and log structured response
    try {
      const parsedResponse = JSON.parse(responseData);
      console.log('📊 Parsed n8n response:', parsedResponse);
    } catch {
      console.log('📄 Raw n8n response (not JSON):', responseData);
    }
    
    return { 
      message: 'Successfully triggered n8n workflow with dynamic Reddit signals.', 
      response: responseData,
      payload: payload
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error triggering n8n webhook:', error);
    throw new Error(`Failed to trigger n8n workflow: ${errorMessage}`);
  }
} 