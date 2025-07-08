import { dbConnect } from '@/lib/dbConnect';
import { authenticate } from '@/middlewares/auth';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { method } from 'lodash';

export async function POST(req) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    if (!user || user.message) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const amount = Number(body.amount);

    if (!amount || amount <= 0) {
      return Response.json({ message: 'Invalid amount' }, { status: 400 });
    }

    // Step 1: Update user balance
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $inc: { 'wallet.balance': amount } },
      { new: true }
    );

    // Step 2: Create transaction record
    await Transaction.create({
      user: user.id,
      type: 'deposit',
      amount,
      method: 'manual',
      description: 'شحن يدوي للمحفظة',
    });
    const transactions = await Transaction.find({ user: user.id }).sort({ date: -1 });
    return Response.json({
      message: 'تم شحن المحفظة بنجاح',
      wallet: {
        balance: updatedUser.wallet.balance,
        currency: updatedUser.wallet.currency,
        transactions
      },
    }, { status: 200 });

  } catch (err) {
    console.error('Manual Charge Error:', err);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
