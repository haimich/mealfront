
import { toast } from 'sonner';

export interface MakeWebhookResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Sends data to a Make.com webhook
 * 
 * @param webhookUrl The Make.com webhook URL to send data to
 * @param data The data to send to the webhook
 * @returns A promise that resolves to the webhook response
 */
export const triggerMakeWebhook = async (
  webhookUrl: string, 
  data: any
): Promise<MakeWebhookResponse> => {
  try {
    if (!webhookUrl) {
      throw new Error('Make.com webhook URL is required');
    }

    console.log('Sending data to Make.com webhook:', data);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'no-cors', // Handle CORS restrictions with Make.com webhooks
    });

    // Since we're using no-cors mode, we won't get a proper response
    // We'll return a success message instead
    console.log('Make.com webhook triggered successfully');
    
    return {
      success: true,
      message: 'Webhook triggered successfully. Check your Make.com scenario for results.'
    };
  } catch (error: any) {
    console.error('Error triggering Make.com webhook:', error);
    toast.error('Failed to trigger Make.com webhook');
    
    return {
      success: false,
      message: error.message || 'Failed to trigger Make.com webhook'
    };
  }
};
