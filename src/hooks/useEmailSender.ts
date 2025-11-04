import { useState } from "react";
import { sendEmail } from "@/services/email";

interface EmailState {
  loading: boolean;
  message: string;
  error: boolean;
}

interface SendEmailParams {
  to: string;
  html: string;
  subject: string;
}

interface EmailResponse {
  message: string;
  [key: string]: unknown;
}

interface SendResult {
  success: boolean;
  data?: EmailResponse;
  error?: string;
}

export function useEmailSender() {
  const [state, setState] = useState<EmailState>({
    loading: false,
    message: "",
    error: false,
  });

  const send = async ({ to, html, subject }: SendEmailParams): Promise<SendResult> => {
    setState({ loading: true, message: "", error: false });

    try {
      const response = await sendEmail(to, html, subject);
      setState({ 
        loading: false, 
        message: `${response.message}`, 
        error: false 
      });
      return { success: true, data: response };
    } catch (error) {
      console.error("Error sending email:", error);
      
      let errorMsg = "Error desconocido al enviar el email";
      
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        const errorWithResponse = error as { response?: { data?: { error?: string } } };
        errorMsg = errorWithResponse.response?.data?.error || errorMsg;
      }
      
      setState({ 
        loading: false, 
        message: `Error: ${errorMsg}`, 
        error: true 
      });
      return { success: false, error: errorMsg };
    }
  };

  const clearMessage = () => {
    setState(prev => ({ ...prev, message: "" }));
  };

  return {
    ...state,
    send,
    clearMessage,
  };
}