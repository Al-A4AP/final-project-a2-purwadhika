import { useState } from "react";

export const useBookingReferral = () => {
  const [referralCode, setReferralCode] = useState("");
  const clearReferralCode = () => setReferralCode("");
  return { clearReferralCode, referralCode, setReferralCode };
};
