import { dbConnect } from '@/lib/dbConnect';
import StudentIdCardRequest from '@/models/StudentCard';
import { authenticate } from '@/middlewares/auth';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    console.log('📊 GET /api/schools/my/:id/card-request/summary');

    await dbConnect();
    const user = await authenticate(req);
    if (!user || user.message) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id: schoolId } = params;
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      return NextResponse.json({ message: 'Invalid school ID' }, { status: 400 });
    }

    // Get request counts
    const matchQuery = {
      school: schoolId,
      student: user.id, // Remove this line if admin access is needed
    };

    const total = await StudentIdCardRequest.countDocuments(matchQuery);

    const recentRequests = await StudentIdCardRequest.find(matchQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('createdAt fields');

    // Optional: Status breakdown if you have a "status" field
    const statusStats = await StudentIdCardRequest.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Optional: Daily submissions (last 7 days)
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 6);

    const dailyStats = await StudentIdCardRequest.aggregate([
      {
        $match: {
          ...matchQuery,
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      summary: {
        total,
        recentRequests,
        statusStats,
        dailyStats,
      },
    });
  } catch (error) {
    console.error('🔥 Error generating dashboard summary:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
