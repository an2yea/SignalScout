/**
 * Interface for the payload to be sent to the n8n Reddit poster workflow.
 */
interface RedditPostPayload {
  postId: string;
  comment: string;
}

/**
 * Triggers an n8n workflow to post a comment on a Reddit post.
 * @param postId The ID of the Reddit post to comment on (e.g., 't3_12345').
 * @param comment The content of the comment to post.
 * @returns A promise that resolves with the response from the n8n workflow.
 */
export async function postCommentToReddit(postId: string, comment: string): Promise<{ message: string; response: string; payload: RedditPostPayload }> {
  // Using a relative path to leverage the Vite proxy and avoid CORS issues.
  // This is the specific webhook for posting Reddit comments.
  const n8nWebhookUrl = '/api/webhook-test/5de054fb-afa7-4d1c-94e9-d9545f73ded2';

  if (!n8nWebhookUrl) {
    console.error('The n8n webhook URL is not defined.');
    throw new Error('The n8n Reddit poster webhook URL is not configured.');
  }

  const payload: RedditPostPayload = {
    postId: postId,
    comment: comment,
  };

  console.log('🚀 Triggering n8n workflow to post on Reddit');
  console.log('📤 Payload being sent to n8n:', JSON.stringify(payload, null, 2));
  console.log('   Webhook URL:', n8nWebhookUrl);

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
      console.error('❌ n8n Reddit poster webhook failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`n8n Reddit poster webhook failed with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.text();
    console.log('✅ n8n Reddit poster workflow triggered successfully');
    console.log('📥 Response from n8n:', responseData);
    
    return { 
      message: 'Successfully triggered n8n workflow to post comment on Reddit.', 
      response: responseData,
      payload: payload
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error triggering n8n Reddit poster webhook:', error);
    throw new Error(`Failed to trigger n8n Reddit poster workflow: ${errorMessage}`);
  }
} 