import { NextRequest, NextResponse } from 'next/server';
import { redis, USER_ID, REDIS_KEYS } from '@/lib/redis';
import type { Dose } from '@/types/dose';

// PUT /api/doses/[id] - Update dose
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount, notes, timestamp } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid dose amount' },
        { status: 400 }
      );
    }

    // Get existing doses
    const existingDoses = await redis.get<Dose[]>(REDIS_KEYS.doses(USER_ID)) || [];
    
    // Find and update the dose
    const doseIndex = existingDoses.findIndex(dose => dose.id === id);
    
    if (doseIndex === -1) {
      return NextResponse.json(
        { error: 'Dose not found' },
        { status: 404 }
      );
    }

    existingDoses[doseIndex] = {
      ...existingDoses[doseIndex],
      amount: parseFloat(amount),
      timestamp: timestamp ? new Date(timestamp) : existingDoses[doseIndex].timestamp,
      notes: notes || undefined,
    };

    // Save to Redis
    await redis.set(REDIS_KEYS.doses(USER_ID), existingDoses);

    return NextResponse.json({ 
      dose: {
        ...existingDoses[doseIndex],
        timestamp: new Date(existingDoses[doseIndex].timestamp),
      }
    });
  } catch (error) {
    console.error('Error updating dose:', error);
    return NextResponse.json(
      { error: 'Failed to update dose' },
      { status: 500 }
    );
  }
}

// DELETE /api/doses/[id] - Delete dose
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get existing doses
    const existingDoses = await redis.get<Dose[]>(REDIS_KEYS.doses(USER_ID)) || [];
    
    // Filter out the dose to delete
    const updatedDoses = existingDoses.filter(dose => dose.id !== id);
    
    if (updatedDoses.length === existingDoses.length) {
      return NextResponse.json(
        { error: 'Dose not found' },
        { status: 404 }
      );
    }

    // Save to Redis
    await redis.set(REDIS_KEYS.doses(USER_ID), updatedDoses);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dose:', error);
    return NextResponse.json(
      { error: 'Failed to delete dose' },
      { status: 500 }
    );
  }
}