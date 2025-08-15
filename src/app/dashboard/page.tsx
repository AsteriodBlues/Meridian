import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/auth/LogoutButton';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-900 via-wisdom-900 to-trust-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-display font-bold text-white mb-4">
                Welcome to Your Dashboard
              </h1>
              <p className="text-gray-300 text-lg">
                Hello, {session.user?.name || session.user?.email}!
              </p>
            </div>
            <LogoutButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Account Balance Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-2">Account Balance</h3>
              <p className="text-3xl font-bold text-growth-400">$12,458.92</p>
              <p className="text-gray-400 text-sm mt-2">+2.3% from last month</p>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-2">Recent Transactions</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Coffee Shop</span>
                  <span className="text-red-400">-$4.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Salary Deposit</span>
                  <span className="text-growth-400">+$3,200.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Grocery Store</span>
                  <span className="text-red-400">-$87.34</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-wisdom-500/20 hover:bg-wisdom-500/30 text-wisdom-300 rounded-lg py-2 px-4 transition-colors">
                  Transfer Money
                </button>
                <button className="w-full bg-trust-500/20 hover:bg-trust-500/30 text-trust-300 rounded-lg py-2 px-4 transition-colors">
                  Pay Bills
                </button>
                <button className="w-full bg-growth-500/20 hover:bg-growth-500/30 text-growth-300 rounded-lg py-2 px-4 transition-colors">
                  Investment Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}