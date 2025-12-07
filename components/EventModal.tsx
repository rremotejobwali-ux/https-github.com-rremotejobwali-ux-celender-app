import React, { useState, useEffect } from 'react';
import { CalendarEvent, EventColor } from '../types';
import { Modal } from './Modal';
import { formatDateForInput } from '../utils/dateUtils';
import { Calendar as CalendarIcon, Clock, Type, AlignLeft } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  initialDate?: Date;
  initialEvent?: CalendarEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, initialDate, initialEvent }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<EventColor>(EventColor.Blue);

  useEffect(() => {
    if (isOpen) {
      if (initialEvent) {
        setTitle(initialEvent.title);
        setStart(initialEvent.start.substring(0, 16));
        setEnd(initialEvent.end.substring(0, 16));
        setDescription(initialEvent.description || '');
        setColor(initialEvent.color);
      } else {
        const d = initialDate || new Date();
        // Default start time: Now, rounded to next hour
        const startDate = new Date(d);
        startDate.setMinutes(0, 0, 0);
        
        // Default end time: Start + 1 hour
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 1);

        setTitle('');
        setStart(formatDateForInput(startDate));
        setEnd(formatDateForInput(endDate));
        setDescription('');
        setColor(EventColor.Blue);
      }
    }
  }, [isOpen, initialDate, initialEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      description,
      color
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialEvent ? 'Edit Event' : 'New Event'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Type className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-10 block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Event Title"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <CalendarIcon className="h-4 w-4 text-gray-400" />
               </div>
              <input
                type="datetime-local"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                required
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <div className="flex space-x-2">
            {Object.values(EventColor).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 ${c.split(' ')[0]} ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 border-gray-400' : 'border-transparent'}`}
                aria-label="Select color"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
           <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <AlignLeft className="h-4 w-4 text-gray-400" />
              </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="pl-10 block w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Add details..."
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Save Event
          </button>
        </div>
      </form>
    </Modal>
  );
};