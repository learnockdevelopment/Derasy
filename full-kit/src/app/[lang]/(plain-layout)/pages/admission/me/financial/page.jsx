'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from '@/hooks/use-toast';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1] || '';

        const res = await fetch('/api/me/wallet', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'فشل تحميل بيانات المحفظة');

        setWallet(data.wallet);
        setTransactions(data.transactions || []);
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: error.message });
      } finally {
        setLoading(false);
      }
    }

    fetchWallet();
  }, []);



  const handleChargeWallet = async () => {
    const { value: amount } = await Swal.fire({
      title: 'شحن المحفظة',
      input: 'number',
      inputLabel: 'أدخل المبلغ بالجنيه',
      inputPlaceholder: 'مثال: 100',
      inputAttributes: {
        min: 1,
        step: 1
      },
      confirmButtonText: 'شحن',
      showCancelButton: true,
      cancelButtonText: 'إلغاء',
      inputValidator: (value) => {
        if (!value || Number(value) <= 0) {
          return 'الرجاء إدخال مبلغ صالح';
        }
      }
    });

    if (!amount) return;

    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1] || '';

      const res = await fetch('/api/me/wallet/charge', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'فشل شحن المحفظة');
      }

      toast({
        title: '✅ تم شحن المحفظة',
        description: `تم إضافة ${Number(amount).toLocaleString('ar-EG')} جنيه إلى رصيدك.`,
      });

      // Optional: Refresh wallet and transaction list
      setWallet(data.wallet);
      setTransactions(data.wallet.transactions || []);

    } catch (error) {
      toast({
        title: '❌ خطأ في الشحن',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  const calculateTotalBalance = () => {
    return transactions.reduce((total, tx) => {
      if (tx.type !== 'withdraw') {
        return total + tx.amount;
      }
      // skip hold_income & hold_expense
      return total;
    }, 0);
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 font-[Cairo]">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-right">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-purple-700">
            <Wallet className="w-6 h-6" /> المحفظة المالية
          </h2>
          <p className="text-3xl font-extrabold text-gray-800">
            {wallet?.balance.toLocaleString('ar-EG')} جنيه
          </p>
        </div>
        {calculateTotalBalance() > 0 && (
          <div className="bg-purple-50 border border-purple-300 rounded-lg p-4 my-4">
            <h3 className="text-purple-700 font-semibold text-sm mb-1">💰 الرصيد الإجمالي</h3>
            <p className="text-lg font-bold text-purple-800">
              {calculateTotalBalance().toLocaleString('ar-EG')} جنيه
            </p>
          </div>
        )}


        <div className="mb-6 text-left">
          <button
            onClick={handleChargeWallet}
            className="inline-flex items-center gap-2 px-5 py-2 bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-700 transition"
          >
            <CreditCard className="w-4 h-4" />
            شحن المحفظة
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">الحركات الأخيرة</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد حركات مالية حالياً.</p>
          ) : (
            <ul className="space-y-4">
              {transactions.map((tx) => {
                const isHold = tx.type.startsWith('hold_');
                const isIncome = ['deposit', 'refund', 'hold_income'].includes(tx.type);
                const isExpense = ['withdraw', 'hold_expense'].includes(tx.type);

                return (
                  <li
                    key={tx._id}
                    className={`p-4 flex items-center justify-between rounded-xl shadow-sm border ${isHold ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full shadow ${isHold ? 'bg-yellow-100' : 'bg-white'}`}>
                        {isIncome ? (
                          <ArrowDownRight className={`${isHold ? 'text-yellow-500' : 'text-green-500'} w-5 h-5`} />
                        ) : (
                          <ArrowUpRight className={`${isHold ? 'text-yellow-500' : 'text-red-500'} w-5 h-5`} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                          {tx.title || 'معاملة مالية'}
                          {isHold && (
                            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                              معلقة
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString('ar-EG')} - {tx.description}
                        </p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${isIncome ? (isHold ? 'text-yellow-600' : 'text-green-600') : (isHold ? 'text-yellow-600' : 'text-red-600')
                      }`}>
                      {isIncome ? '+' : '-'}{tx.amount.toLocaleString('ar-EG')} جنيه
                    </div>
                  </li>
                );
              })}

            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
