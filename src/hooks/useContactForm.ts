
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  organization?: string;
  phone?: string;
}

const submitContactMessage = async (data: ContactFormData) => {
  const { error } = await supabase
    .from('contact_messages')
    .insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      organization: data.organization,
      phone: data.phone,
      status: 'nouveau',
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};

export const useContactForm = () => {
  const submitContactForm = useMutation({
    mutationFn: submitContactMessage,
  });

  return {
    submitContactForm,
    isLoading: submitContactForm.isPending
  };
};
