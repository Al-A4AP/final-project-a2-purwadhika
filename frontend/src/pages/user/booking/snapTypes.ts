export type SnapPaymentOptions = {
  onSuccess: () => void;
  onPending: () => void;
  onError: () => void;
  onClose: () => void;
};

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: SnapPaymentOptions) => void;
    };
  }
}

export {};
