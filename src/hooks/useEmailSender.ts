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

export function useEmailSender() {
  const [state, setState] = useState<EmailState>({
    loading: false,
    message: "",
    error: false,
  });

  const send = async ({ to, html, subject }: SendEmailParams) => {
    setState({ loading: true, message: "", error: false });

    try {
      const response = await sendEmail(to, html, subject);
      setState({ 
        loading: false, 
        message: `${response.message}`, 
        error: false 
      });
      return { success: true, data: response };
    } catch (error: any) {
      console.error("Error sending email:", error);
      const errorMsg = error.response?.data?.error || error.message;
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