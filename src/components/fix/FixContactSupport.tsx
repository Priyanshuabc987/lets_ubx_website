import { Phone, MessageCircle } from 'lucide-react';

interface FixContactSupportProps {
  registration?: {
    name?: string;
    startup_name?: string;
  } | null;
  context?: 'check' | 'status';
}

export function FixContactSupport({ registration, context = 'check' }: FixContactSupportProps) {
  const whatsappNumber = "7406345305";

  let message = "I want to know about my application status.";

  if (context === 'status' && registration?.startup_name) {
    message = `I want to know more about my application status for startup: ${registration.startup_name}${registration.name ? ` (Applicant: ${registration.name})` : ''}`;
  }

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="mt-8 text-center space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Need help or faster updates?</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-2.5 bg-[#25D366]/10 text-[#128C7E] rounded-full text-sm font-bold transition-all hover:bg-[#25D366]/20 border border-[#25D366]/20"
        >
          <MessageCircle className="w-4 h-4" />
          Message on WhatsApp
        </a>
        <a
          href="tel:+917406345305"
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold transition-all hover:bg-blue-100 border border-blue-100"
        >
          <Phone className="w-4 h-4" />
          Call Support
        </a>
      </div>
      {/* <p className="text-[10px] text-zinc-400 font-medium">Available for shortlisted & confirmed startups</p> */}
    </div>
  );
}
