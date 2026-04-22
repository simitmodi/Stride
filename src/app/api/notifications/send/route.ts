import { NextResponse } from "next/server";
import webpush from "web-push";

type PushSubscriptionShape = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

const globalForPush = globalThis as typeof globalThis & {
  __stridePushSubscriptions?: Set<string>;
};

function getSubscriptionStore() {
  if (!globalForPush.__stridePushSubscriptions) {
    globalForPush.__stridePushSubscriptions = new Set<string>();
  }
  return globalForPush.__stridePushSubscriptions;
}

function configureWebPush() {
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export async function POST(req: Request) {
  const configured = configureWebPush();
  if (!configured) {
    return NextResponse.json(
      {
        error:
          "VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, and VAPID_PRIVATE_KEY are required.",
      },
      { status: 400 }
    );
  }

  const body = await req.json();
  const payload = JSON.stringify({
    title: body?.title ?? "Stride Notification",
    body: body?.body ?? "You have a new update.",
    url: body?.url ?? "/dashboard",
    icon: body?.icon ?? "/icon.png",
    badge: body?.badge ?? "/icon.png",
  });

  const store = getSubscriptionStore();
  if (store.size === 0) {
    return NextResponse.json({ ok: true, delivered: 0, reason: "No subscribers yet." });
  }

  const invalid: string[] = [];
  let delivered = 0;

  await Promise.all(
    [...store].map(async (raw) => {
      const subscription = JSON.parse(raw) as PushSubscriptionShape;
      try {
        await webpush.sendNotification(subscription, payload);
        delivered += 1;
      } catch (error: any) {
        const statusCode = error?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          invalid.push(raw);
        } else {
          console.error("Push send failed", error);
        }
      }
    })
  );

  for (const deadSub of invalid) {
    store.delete(deadSub);
  }

  return NextResponse.json({ ok: true, delivered, total: store.size });
}
