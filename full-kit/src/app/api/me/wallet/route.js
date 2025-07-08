import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { authenticate } from '@/middlewares/auth';

export async function GET(req) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.message) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get wallet info
    const dbUser = await User.findById(user.id).select('wallet');
    if (!dbUser) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // Get transactions from separate model
    const transactions = await Transaction.find({ user: user.id }).sort({ date: -1 });

    return Response.json({
      wallet: {
        balance: dbUser.wallet.balance,
        currency: dbUser.wallet.currency,
      },
      transactions
    });
  } catch (error) {
    console.error('❌ Error fetching wallet:', error);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
