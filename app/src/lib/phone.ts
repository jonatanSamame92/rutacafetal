export function normalizePeruPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("51") && digits.length === 11) return `+${digits}`;
  if (digits.length === 9) return `+51${digits}`;
  return value.startsWith("+") ? value : `+${digits}`;
}

export function formatPeruPhone(value: string) {
  const digits = value.replace(/^\+51/, "");
  if (digits.length !== 9) return value;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function toWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function buildSupportContact(configuredPhone?: string) {
  if (!configuredPhone?.trim()) return null;
  const phone = normalizePeruPhone(configuredPhone.trim());
  if (!/^\+51[0-9]{9}$/.test(phone)) return null;
  return {
    label: formatPeruPhone(phone),
    url: toWhatsAppUrl(phone, "Hola, necesito ayuda con mi cuenta de Rutacafetal."),
  };
}
