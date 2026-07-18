import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Ayuda" };
export default function HelpPage() { return <LegalPage title="Ayuda y soporte" intro="Durante el piloto, una persona administrará solicitudes, recuperación de acceso, campañas y reportes."><section><h2>Recuperar acceso</h2><p>Si olvidaste tu contraseña, contacta al administrador desde el mismo celular registrado. No compartas contraseñas ni códigos con otras personas.</p></section><section><h2>Estado de una solicitud</h2><p>Las solicitudes se revisan manualmente. Recibirás una respuesta por el canal que hayas proporcionado.</p></section><section><h2>Canal oficial pendiente</h2><p>Antes del lanzamiento público se publicará aquí el número de WhatsApp o correo oficial de Rutacafetal para soporte y apelaciones.</p></section></LegalPage>; }
