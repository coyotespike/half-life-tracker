'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import type { Dose } from '@/types/dose';

interface DoseFormProps {
  dose?: Dose | null;
  onSave: (data: { amount: number; notes?: string; timestamp?: Date }) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function DoseForm({ dose, onSave, onDelete, onClose, isLoading }: DoseFormProps) {
  const [amount, setAmount] = useState(dose?.amount?.toString() || '');
  const [notes, setNotes] = useState(dose?.notes || '');
  const [dateTime, setDateTime] = useState(() => {
    if (dose) {
      const date = new Date(dose.timestamp);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    }
    return format(new Date(), "yyyy-MM-dd'T'HH:mm");
  });
  const [errors, setErrors] = useState<{ amount?: string; dateTime?: string }>({});

  const isEditing = !!dose;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const numAmount = parseFloat(amount);
    const selectedDate = new Date(dateTime);
    const now = new Date();
    
    const newErrors: { amount?: string; dateTime?: string } = {};
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid dose amount';
    }
    
    if (!dateTime || isNaN(selectedDate.getTime())) {
      newErrors.dateTime = 'Please enter a valid date and time';
    } else if (selectedDate > now) {
      newErrors.dateTime = 'Cannot enter a future date';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await onSave({
        amount: numAmount,
        notes: notes.trim() || undefined,
        timestamp: selectedDate,
      });
      onClose();
    } catch (error) {
      console.error('Error saving dose:', error);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (confirm('Are you sure you want to delete this dose?')) {
      try {
        await onDelete();
        onClose();
      } catch (error) {
        console.error('Error deleting dose:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Dose' : 'Add New Dose'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Dose Amount (mg)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                errors.amount ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="2.5"
              autoFocus
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Date/Time Input */}
          <div>
            <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                errors.dateTime ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.dateTime && (
              <p className="mt-1 text-sm text-red-600">{errors.dateTime}</p>
            )}
          </div>

          {/* Notes Input */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Any notes about this dose..."
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete
              </Button>
            )}
            
            <div className="flex gap-3 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Add Dose'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}