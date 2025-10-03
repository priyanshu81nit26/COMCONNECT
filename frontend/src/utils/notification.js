const notificationSound = new Audio('/notification.mp3'); // Add an MP3 file to your public folder

export const playNotificationSound = () => {
  notificationSound.play().catch(error => {
    console.log('Error playing notification sound:', error);
  });
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}; 