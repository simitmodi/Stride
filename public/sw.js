self.addEventListener("push", (event) => {
  let payload = {
    title: "Stride Notification",
    body: "You have a new update.",
    icon: "/icon.png",
    badge: "/icon.png",
    url: "/dashboard",
  };

  if (event.data) {
    try {
      const data = event.data.json();
      payload = {
        ...payload,
        ...data,
      };
    } catch {
      payload.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      data: {
        url: payload.url || "/dashboard",
      },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});
