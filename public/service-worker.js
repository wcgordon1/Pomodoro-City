self.addEventListener('push', function(event) {
  const title = 'Pomodoro Timer';
  const options = {
    body: event.data.text(),
    icon: '/icon.png',
    badge: '/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});