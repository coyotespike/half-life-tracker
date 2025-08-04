'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/dashboard';
import { DoseForm } from '@/components/dose-form';
import type { Dose } from '@/types/dose';

export default function Home() {
  const [doses, setDoses] = useState<Dose[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDose, setEditingDose] = useState<Dose | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Fetch doses on mount
  useEffect(() => {
    fetchDoses();
  }, []);

  const fetchDoses = async () => {
    try {
      const response = await fetch('/api/doses');
      const data = await response.json();
      setDoses(data.doses || []);
    } catch (error) {
      console.error('Error fetching doses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDose = () => {
    setEditingDose(null);
    setShowForm(true);
  };

  const handleEditDose = (dose: Dose) => {
    setEditingDose(dose);
    setShowForm(true);
  };

  const handleSaveDose = async (data: { amount: number; notes?: string; timestamp?: Date }) => {
    setIsFormLoading(true);
    
    try {
      if (editingDose) {
        // Update existing dose
        const response = await fetch(`/api/doses/${editingDose.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Failed to update dose');
      } else {
        // Add new dose
        const response = await fetch('/api/doses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Failed to add dose');
      }
      
      // Refresh doses
      await fetchDoses();
    } catch (error) {
      console.error('Error saving dose:', error);
      throw error;
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteDose = async () => {
    if (!editingDose) return;
    
    setIsFormLoading(true);
    
    try {
      const response = await fetch(`/api/doses/${editingDose.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete dose');
      
      // Refresh doses
      await fetchDoses();
    } catch (error) {
      console.error('Error deleting dose:', error);
      throw error;
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDose(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard
        doses={doses}
        onAddDose={handleAddDose}
        onEditDose={handleEditDose}
      />
      
      {showForm && (
        <DoseForm
          dose={editingDose}
          onSave={handleSaveDose}
          onDelete={editingDose ? handleDeleteDose : undefined}
          onClose={handleCloseForm}
          isLoading={isFormLoading}
        />
      )}
    </div>
  );
}
