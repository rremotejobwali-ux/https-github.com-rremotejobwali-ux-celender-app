import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { Modal } from './Modal';
import { parseEventNaturalLanguage } from '../services/geminiService';
import { Sparkles, Loader2, Send } from 'lucide-react';

interface SmartAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventParsed: (event: Omit<CalendarEvent, 'id'>) => void;
}

export const SmartAddModal: React.FC<SmartAddModalProps> = ({ isOpen, onClose, onEventParsed }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const result = await parseEventNaturalLanguage(input, now);

      if (result) {
        onEventParsed(result as any); // Cast to any to bypass strict enum type check safely here as we trust the API or fallback
        setInput('');
        onClose();
      } else {
        setError('Could not understand the event. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Smart Add with Gemini">
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Describe your event naturally. For example: <br/>
            <span className="italic font-medium">"Lunch with Sarah next Tuesday at 12:30 PM"</span> or 
            <span className="italic font-medium"> "Project deadline on Friday 5pm"</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 bg-white shadow-sm"
              placeholder="Type your plans here..."
              disabled={isLoading}
              autoFocus
            />
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Create Event</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};