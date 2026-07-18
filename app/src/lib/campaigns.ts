export type Campaign = {
  slug: string;
  title: string;
  farm: string;
  district: string;
  province: string;
  startDate: string;
  endDate: string;
  workType: string;
  payment: string;
  paymentDetail: string;
  workersNeeded: number;
  includesFood: boolean;
  includesLodging: boolean;
  description: string;
  locationReference: string;
  safetyNote: string;
  rating: number;
};

export const campaigns: Campaign[] = [
  { slug: "cosecha-finca-santa-rosa", title: "Cosecha de café", farm: "Finca Santa Rosa", district: "Chontalí", province: "Jaén", startDate: "12 de agosto", endDate: "20 de septiembre", workType: "Cosecha", payment: "Por arroba", paymentDetail: "S/ 18 por arroba", workersNeeded: 8, includesFood: true, includesLodging: true, description: "Buscamos personas con experiencia en cosecha de café maduro. La cuadrilla trabaja en horarios de mañana y tarde, con descanso al mediodía.", locationReference: "A 30 minutos de Chontalí, por la ruta a La Palma.", safetyNote: "Trae botas y ropa para lluvia. La finca cuenta con punto de encuentro y normas de trabajo claras.", rating: 4.8 },
  { slug: "mantenimiento-el-mirador", title: "Mantenimiento de cafetal", farm: "Finca El Mirador", district: "Bellavista", province: "Jaén", startDate: "18 de agosto", endDate: "30 de agosto", workType: "Mantenimiento", payment: "Por día", paymentDetail: "S/ 55 por día", workersNeeded: 4, includesFood: true, includesLodging: false, description: "Campaña de deshierbe y abonado en cafetal. Ideal para personas que viven en Bellavista o pueden movilizarse por sus propios medios.", locationReference: "A 15 minutos de Bellavista, cerca del desvío San Juan.", safetyNote: "Se trabaja con herramientas de la finca. Recibirás indicaciones antes de empezar cada jornada.", rating: 4.6 },
  { slug: "postcosecha-la-esperanza", title: "Apoyo en postcosecha", farm: "Finca La Esperanza", district: "San José del Alto", province: "Jaén", startDate: "25 de agosto", endDate: "15 de septiembre", workType: "Postcosecha", payment: "Por semana", paymentDetail: "S/ 360 por semana", workersNeeded: 3, includesFood: true, includesLodging: true, description: "Apoyo en selección, lavado y secado de café. Se valora experiencia en beneficio húmedo, aunque la finca brinda una inducción inicial.", locationReference: "A 40 minutos de San José del Alto, con movilidad coordinada desde el distrito.", safetyNote: "La campaña incluye inducción de seguridad y alojamiento compartido para la cuadrilla.", rating: 4.9 },
];

export function getCampaign(slug: string) { return campaigns.find((campaign) => campaign.slug === slug); }
