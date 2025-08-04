import { NextRequest, NextResponse } from 'next/server';
import { redis, USER_ID, REDIS_KEYS } from '@/lib/redis';
import type { Dose } from '@/types/dose';

// GET /api/doses - Fetch all doses
export async function GET() {
  try {
    const doses = await redis.get<Dose[]>(REDIS_KEYS.doses(USER_ID)) || [];
    
    // Convert string dates back to Date objects
    const dosesWithDates = doses.map(dose => ({
      ...dose,
      timestamp: new Date(dose.timestamp),
    }));
    
    return NextResponse.json({ doses: dosesWithDates });
  } catch (error) {
    console.error('Error fetching doses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doses' },
      { status: 500 }
    );
  }
}

// POST /api/doses - Add new dose
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, notes, timestamp } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid dose amount' },
        { status: 400 }
      );
    }

    const newDose: Dose = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      notes: notes || undefined,
    };

    // Get existing doses
    const existingDoses = await redis.get<Dose[]>(REDIS_KEYS.doses(USER_ID)) || [];
    
    // Add new dose
    const updatedDoses = [...existingDoses, newDose];
    
    // Save to Redis
    await redis.set(REDIS_KEYS.doses(USER_ID), updatedDoses);

    return NextResponse.json({ 
      dose: {
        ...newDose,
        timestamp: newDose.timestamp,
      }
    });
  } catch (error) {
    console.error('Error adding dose:', error);
    return NextResponse.json(
      { error: 'Failed to add dose' },
      { status: 500 }
    );
  }
}