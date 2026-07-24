import React, { Suspense } from "react";
import OrderConfirmationContent from "./OrderConfirmationContent";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const orderNumber = typeof resolvedSearchParams.order === "string" ? resolvedSearchParams.order : undefined;

  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-background pt-28 pb-16 md:pt-36 md:pb-24 font-sans text-foreground">
          <div className="max-w-4xl mx-auto px-4 space-y-8 animate-pulse">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-border-custom mx-auto" />
              <div className="h-8 bg-border-custom rounded-md w-64 mx-auto" />
              <div className="h-4 bg-border-custom rounded-md w-96 mx-auto" />
            </div>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent orderNumber={orderNumber} />
    </Suspense>
  );
}
