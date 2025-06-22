/**
 * Trigger n8n Reddit search workflow
 */
export async function triggerN8nWorkflow(): Promise<{ message: string; response: string }> {
  const n8nWebhookUrl = 'https://nishitrl.app.n8n.cloud/webhook/8138febd-bbde-4789-99bf-cbb41d33c756';

  const subreddits = ['LangChain', 'crewai', 'AI_Agents'];
  const redditSearchUrl = `https://oauth.reddit.com/r/${subreddits.join('+')}/search`;
  
  const keywords = `("stuck" OR "blocked" OR "frustrated" OR "hate" OR "nightmare" OR "pulling my hair" OR "hours wasted" OR "flaky integration") AND ("langchain" OR "crewai" OR "llamaindex" OR "function calling" OR "oauth" OR "token refresh" OR "integration")`;

  const payload = {
    keywords: keywords,
    subcommunities: redditSearchUrl,
  };

  console.log('Triggering n8n workflow with payload:', payload);

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
      throw new Error(`n8n webhook failed with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.text();
    console.log('n8n workflow triggered successfully:', responseData);
    
    return { 
      message: 'Successfully triggered n8n workflow.', 
      response: responseData 
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error triggering n8n webhook:', error);
    throw new Error(`Failed to trigger n8n workflow: ${errorMessage}`);
  }
} 