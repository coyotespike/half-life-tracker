import { NextResponse } from 'next/server';
import { redis, USER_ID, REDIS_KEYS } from '@/lib/redis';
import type { Dose } from '@/types/dose';

// GET /api/debug - Debug endpoint to inspect Redis data
export async function GET() {
  try {
    const rawDoses = await redis.get<Dose[]>(REDIS_KEYS.doses(USER_ID)) || [];
    
    // Convert timestamps and add debug info
    const dosesWithDebugInfo = rawDoses.map(dose => ({
      ...dose,
      timestamp: new Date(dose.timestamp),
      timestampString: dose.timestamp.toString(),
      timestampType: typeof dose.timestamp,
    }));
    
    return NextResponse.json({ 
      totalDoses: rawDoses.length,
      doses: dosesWithDebugInfo,
      redisKey: REDIS_KEYS.doses(USER_ID),
    });
  } catch (error) {
    console.error('Error fetching debug info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug info' },
      { status: 500 }
    );
  }
}

// DELETE /api/debug - Clear all dose data (use with caution!)
export async function DELETE() {
  try {
    await redis.del(REDIS_KEYS.doses(USER_ID));
    return NextResponse.json({ message: 'All dose data cleared' });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    );
  }
}