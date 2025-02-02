
import React from "react";
import { useSubscriptionPopup } from "../store/useStore";

const UpgradeToPremium = () => {
  const { showUpgradePopup, setShowUpgradePopup } = useSubscriptionPopup();

  if (!showUpgradePopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <h3 className="text-lg font-semibold mb-4">Upgrade to Premium</h3>
        <p className="text-sm text-gray-600">
          You're currently on a trial plan. Upgrade to premium to unlock chat
          history and other exclusive features.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setShowUpgradePopup(false)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <button
            onClick={() => {
              setShowUpgradePopup(false);
              window.location.href = "/subscription"; // Redirect to subscription page
            }}
            className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToPremium;
