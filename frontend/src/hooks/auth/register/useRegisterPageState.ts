import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/authStore";
import { getAuthRoleFromPath, type TargetAuthRole } from "@/lib/authRole";
import { registerSchema, type RegisterInput } from "@/validations/auth";
import type { Role, User } from "@/types";
import type { RegisterPageState } from "./registerTypes";
import { useRegisterGoogle } from "./useRegisterGoogle";
import { useRegisterSubmit } from "./useRegisterSubmit";

const selectSetUser = (state: { setUser: (user: User | null) => void }) => state.setUser;

export const useRegisterPageState = (targetRole?: TargetAuthRole): RegisterPageState => {
  const role = useRegisterRole(targetRole);
  const defaultRole: Role = role || "USER";
  const form = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), defaultValues: { role: defaultRole } });
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUser = useAuthStore(selectSetUser);
  const onSubmit = useRegisterSubmit(form.setError, setRegisteredEmail);
  const handleGoogleLogin = useRegisterGoogle(defaultRole, form.setError, setUser, navigate);
  return { form, role, defaultRole, registeredEmail, handleGoogleLogin, onSubmit };
};

const useRegisterRole = (targetRole?: TargetAuthRole) => {
  const location = useLocation();
  return targetRole || getAuthRoleFromPath(location.pathname);
};
