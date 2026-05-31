export const appendMidtransScript = () => {
  const script = document.createElement("script");
  script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
  script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "");
  document.body.appendChild(script);
  return script;
};

export const removeMidtransScript = (script: HTMLScriptElement) => {
  document.body.removeChild(script);
};
