import type { District } from "@/types/article";

// Official Andhra Pradesh districts (26 districts, post-2022 reorganization)
export const AP_DISTRICTS: District[] = [
  { slug: "alluri-sitharama-raju", name: "Alluri Sitharama Raju", telugu: "అల్లూరి సీతారామరాజు" },
  { slug: "anakapalli", name: "Anakapalli", telugu: "అనకాపల్లి" },
  { slug: "ananthapuramu", name: "Ananthapuramu", telugu: "అనంతపురము" },
  { slug: "bapatla", name: "Bapatla", telugu: "బాపట్ల" },
  { slug: "chittoor", name: "Chittoor", telugu: "చిత్తూరు" },
  { slug: "east-godavari", name: "East Godavari", telugu: "తూర్పు గోదావరి" },
  { slug: "eluru", name: "Eluru", telugu: "ఏలూరు" },
  { slug: "guntur", name: "Guntur", telugu: "గుంటూరు" },
  { slug: "kakinada", name: "Kakinada", telugu: "కాకినాడ" },
  { slug: "konaseema", name: "Konaseema", telugu: "కోనసీమ" },
  { slug: "krishna", name: "Krishna", telugu: "కృష్ణా" },
  { slug: "kurnool", name: "Kurnool", telugu: "కర్నూలు" },
  { slug: "manyam", name: "Parvathipuram Manyam", telugu: "పార్వతీపురం మన్యం" },
  { slug: "nandyal", name: "Nandyal", telugu: "నంద్యాల" },
  { slug: "ntr", name: "NTR (Vijayawada)", telugu: "ఎన్టీఆర్" },
  { slug: "nellore", name: "Sri Potti Sriramulu Nellore", telugu: "నెల్లూరు" },
  { slug: "prakasam", name: "Prakasam", telugu: "ప్రకాశం" },
  { slug: "sri-sathya-sai", name: "Sri Sathya Sai", telugu: "శ్రీ సత్యసాయి" },
  { slug: "srikakulam", name: "Srikakulam", telugu: "శ్రీకాకుళం" },
  { slug: "tirupati", name: "Tirupati", telugu: "తిరుపతి" },
  { slug: "visakhapatnam", name: "Visakhapatnam", telugu: "విశాఖపట్నం" },
  { slug: "vizianagaram", name: "Vizianagaram", telugu: "విజయనగరం" },
  { slug: "west-godavari", name: "West Godavari", telugu: "పశ్చిమ గోదావరి" },
  { slug: "ysr-kadapa", name: "YSR Kadapa", telugu: "వైఎస్ఆర్ కడప" },
];

export function getDistrictBySlug(slug: string): District | undefined {
  return AP_DISTRICTS.find((d) => d.slug === slug);
}

export function getDistrictName(slug: string): string {
  return getDistrictBySlug(slug)?.name ?? slug;
}
