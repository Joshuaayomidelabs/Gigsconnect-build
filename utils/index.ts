export const openSignupModal = () => {
  window.dispatchEvent(new CustomEvent('open-signup'));
};
