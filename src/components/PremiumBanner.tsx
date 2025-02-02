import { Crown } from 'lucide-react';
import { useStore, useUserStore } from '../store/useStore';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export function PremiumBanner() {
  const { userId,subscriptionType} = useUserStore();

  if (subscriptionType ==='Premium') return null;

  const handleUpgrade = async (plan: string) => {
    try {
      const response = await axios.post('http://localhost:3000/sub/update-subscription', {
        userId: userId,
        subscriptionType: plan,
       withCredentials:true 
      });
      console.log("updated subscription",response)
      toast(`subscription updated to ${plan}`)

      // alert(`Subscription updated to ${plan}`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Subscription update failed');
    }
  };
  return (
    <div className="relative ">
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50  gap-11 z-50">
          <h3 className="text-lg font-semibold mb-4">Choose a Plan</h3>
          <div className="space-y-3 flex justify-between  h-[200px] gap-8 w-[600px] bg-black bg-opacity-1">
            {/* Free Trial Card */}
            <div
              className="p-4 rounded-lg cursor-pointer bg-gray-600 hover:bg-gray-800 gap-4"
              onClick={() => handleUpgrade('7-day-premium')}
            >
              <h4 className="font-medium">Free Trial</h4>
              <p className="text-sm text-gray-600">7 days free</p>
              <p className="text-sm text-gray-600">No credit card required</p>
            </div>

            {/* Premium Card */}
            <div
              className="p-4 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-800 gap-4"
              onClick={() => handleUpgrade('premium')}
            >
              <h4 className="font-medium">Premium</h4>
              <p className="text-sm text-gray-600">$9.99/month</p>
              <p className="text-sm text-gray-600">Unlock all features</p>
            </div>

            {/* Additional Plan (Optional) */}
            <div
              className="p-4 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-800 gap-4"
              onClick={() => handleUpgrade('premium-yearly')}
            >
              <h4 className="font-medium">Premium (Yearly)</h4>
              <p className="text-sm text-gray-600">$99/year</p>
              <p className="text-sm text-gray-600">Save $20 annually</p>
            </div>
          </div>
        </div>
      
    </div>
  );
}