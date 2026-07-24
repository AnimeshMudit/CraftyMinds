import { redirect } from "next/navigation";

interface RouteParams {
  params: Promise<{ orderNumber: string }>;
}

export default async function LegacyOrderConfirmationPage({ params }: RouteParams) {
  const { orderNumber } = await params;
  redirect(`/order-confirmation?order=${orderNumber}`);
}
