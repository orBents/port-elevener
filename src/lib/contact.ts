export type DirectContacts = {
  email?: string;
  whatsapp?: string;
  showEmailInFooter?: boolean;
  showWhatsAppInFooter?: boolean;
};

export type ContactLink = {
  label: string;
  href: string;
  external: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value?: string) {
  const email = value?.trim().toLowerCase();
  return email && emailPattern.test(email) ? email : undefined;
}

export function normalizeWhatsApp(value?: string) {
  const digits = value?.replace(/\D/g, "");
  return digits && /^\d{8,15}$/.test(digits) ? digits : undefined;
}

export function directContactLinks(contacts: DirectContacts | undefined, footerOnly = false): ContactLink[] {
  const email = normalizeEmail(contacts?.email);
  const whatsapp = normalizeWhatsApp(contacts?.whatsapp);
  return [
    email && (!footerOnly || contacts?.showEmailInFooter !== false)
      ? { label: "E-mail", href: `mailto:${email}`, external: false }
      : undefined,
    whatsapp && (!footerOnly || contacts?.showWhatsAppInFooter !== false)
      ? { label: "WhatsApp", href: `https://wa.me/${whatsapp}`, external: true }
      : undefined,
  ].filter((link): link is ContactLink => Boolean(link));
}
