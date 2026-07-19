import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getSupportContact } from "@/lib/support";

export const metadata: Metadata = { title: "Ayuda" };
export default function HelpPage() {
  const support = getSupportContact();
  return <LegalPage title="Ayuda y soporte" intro="Durante el piloto, una persona administrará solicitudes, recuperación de acceso, campañas y reportes."><section><h2>Recuperar acceso</h2><p>Si olvidaste tu contraseña, contacta al administrador desde el mismo celular registrado. No compartas contraseñas ni códigos con otras personas.</p></section><section><h2>Estado de una solicitud</h2><p>Las solicitudes se revisan manualmente. Recibirás una respuesta por el canal que hayas proporcionado.</p></section><section><h2>Canal oficial</h2>{support ? <><p>Escríbenos al {support.label}. Usa este canal para soporte y apelaciones; nunca te pediremos tu contraseña.</p><a className="button-primary mt-4" href={support.url} target="_blank" rel="noreferrer">Abrir soporte por WhatsApp</a></> : <p className="status-message">El canal de soporte se activará junto con las cuentas reales. Esta versión demostrativa no procesa solicitudes.</p>}</section></LegalPage>;
}
