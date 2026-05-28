export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const checkVideoConstraints = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    if (file.size > 50 * 1024 * 1024) {
      resolve("Video must be 90 seconds or less and under 50MB.");
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function() {
      URL.revokeObjectURL(video.src);
      if (video.duration > 90) {
        resolve("Video must be 90 seconds or less and under 50MB.");
      } else {
        resolve(null);
      }
    };

    video.onerror = function() {
      URL.revokeObjectURL(video.src);
      resolve("Could not read video metadata.");
    };

    video.src = URL.createObjectURL(file);
  });
};

