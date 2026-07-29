export const contactConfig = {
  whatsAppNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917668251162",
  whatsAppDisplay: "+91 76682 51162",
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "@craftymindstudios_",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/craftymindstudios_",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "craftymindstudios@gmail.com",
};

/**
 * Generates a WhatsApp URL with a prefilled message.
 * @param text Optional message. If omitted, uses the default products question.
 */
export const getWhatsAppLink = (text?: string) => {
  const message = text || "Hi Crafty Mind Studio! I have a question about your products.";
  return `https://wa.me/${contactConfig.whatsAppNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Generates a WhatsApp URL specifically for questions about a dynamic product title.
 * @param productTitle The name/title of the product.
 */
export const getProductWhatsAppLink = (productTitle: string) => {
  const message = `Hi Crafty Mind Studio! I'm interested in the "${productTitle}". Could you tell me more about it?`;
  return getWhatsAppLink(message);
};
