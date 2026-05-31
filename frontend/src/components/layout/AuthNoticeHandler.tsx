import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getAuthNoticeMessage, takeStoredAuthNotice, type AuthNotice } from '@/lib/authNotice';

interface LocationState {
  authNotice?: AuthNotice;
}

function getLocationNotice(state: unknown) {
  return (state as LocationState | null)?.authNotice;
}

export const AuthNoticeHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const notice = getLocationNotice(location.state) || takeStoredAuthNotice();
    const message = getAuthNoticeMessage(notice || undefined);
    if (!message) return;
    toast.error(message);
    if (location.state) navigate(location.pathname, { replace: true, state: null });
  }, [location.key, location.pathname, location.state, navigate]);

  return null;
};
