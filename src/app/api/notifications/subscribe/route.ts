import { NextResponse } from "next/server";

const globalForPush = globalThis as typeof globalThis & {
  __stridePushSubscriptions?: Set<string>;
};

function getSubscriptionStore() {
  if (!globalForPush.__stridePushSubscriptions) {
    globalForPush.__stridePushSubscriptions = new Set<string>();
  }
  return globalForPush.__stridePushSubscriptions;
}

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid push subscription." }, { status: 400 });
    }

    const store = getSubscriptionStore();
    store.add(JSON.stringify(subscription));

    return NextResponse.json({ ok: true, count: store.size });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
