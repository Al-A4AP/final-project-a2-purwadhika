import { useState } from "react";

export const usePasswordVisibility = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return {
    showConfirmPassword,
    showNewPassword,
    toggleConfirmPassword: () => setShowConfirmPassword((value) => !value),
    toggleNewPassword: () => setShowNewPassword((value) => !value),
  };
};
