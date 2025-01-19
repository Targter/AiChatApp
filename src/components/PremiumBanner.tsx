import { Crown } from 'lucide-react';
import { useStore } from '../store/useStore';

export function PremiumBanner() {
  const { user, setUser } = useStore();

  if (user.isPremium) return null;

  const handleUpgrade = () => {
    // Simulate payment process
    if (confirm('Upgrade to Premium for $9.99/month?')) {
      setUser({ ...user, isPremium: true });
    }
  };

  return (
    <div className="">
      <button
        onClick={handleUpgrade}
        className="flex items-center md:space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white md:px-4 md:py-2 p-1 rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-all "
      >
        <Crown className="md:h-5 md:w-5" />
        <span className='text-sm md:text-lg'>Upgrade to Premium</span>
      </button>
    </div>
  );
}