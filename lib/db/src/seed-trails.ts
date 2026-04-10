import { db } from "./index";
import { trailsTable } from "./schema/trails";

type Trail = typeof trailsTable.$inferInsert;

const trails: Trail[] = [
  // ─── BUCEGI ────────────────────────────────────────────────────────────────
  {
    name: "Bucegi-fennsík körút",
    location: "Prahova megye – Bucegi",
    description: "A Bucegi-fennsík klasszikus körtúrája Sinajáról. Útközben a Szfinx és Babele sziklaformációk, a Caraiman-csúcs hatalmas keresztje és pazar panoráma a Déli-Kárpátokra.",
    distance: 22.0, elevation: 2505, difficulty: "Nagyon nehéz", duration: "10 óra",
    start_lat: 45.349, start_lon: 25.555, end_lat: 45.349, end_lon: 25.555,
    coordinates: [[45.349,25.555],[45.38,25.535],[45.41,25.52],[45.42,25.518],[45.4,25.525],[45.349,25.555]] as [number,number][],
    points_of_interest: [
      { name: "Szfinx (Sfinxul)", lat: 45.401, lon: 25.526, description: "Egyedi szél által formált kőszobor" },
      { name: "Babele", lat: 45.405, lon: 25.521, description: "Gombaalakú sziklaformációk" },
      { name: "Caraiman-csúcs", lat: 45.41, lon: 25.518, description: "2384 m, hatalmas vaskereszt" },
    ],
    tags: ["fennsík","szikla","körút","panoráma","bucegi"], image_url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
  },
  {
    name: "Jepii Mici – Strunga szoros",
    location: "Prahova megye – Bucegi",
    description: "Meredek sziklafalak között vezető kalandos túra a Bucegiben. A Jepii Mici-csúcsról lenyűgöző rálátás nyílik a völgyre és a Bucegi-masszívum belső részére.",
    distance: 13.5, elevation: 1750, difficulty: "Nehéz", duration: "6-7 óra",
    start_lat: 45.395, start_lon: 25.492, end_lat: 45.395, end_lon: 25.492,
    coordinates: [[45.395,25.492],[45.41,25.5],[45.42,25.51],[45.41,25.5],[45.395,25.492]] as [number,number][],
    points_of_interest: [
      { name: "Jepii Mici csúcs", lat: 45.415, lon: 25.505, description: "Pazar kilátás a Prahova-völgyre" },
      { name: "Strunga szoros", lat: 45.412, lon: 25.508, description: "Sziklás átjáró" },
    ],
    tags: ["sziklás","kaland","csúcs","völgy","bucegi"], image_url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  },
  {
    name: "Omu-csúcs – Bucegi legmagasabb pontja",
    location: "Prahova/Dâmbovița megye – Bucegi",
    description: "A Bucegi-fennsík legmagasabb csúcsára (2505 m) vezető klasszikus túra. Az Omu-menedékháznál szinte egész évben köd és szél fogad, de időjárás esetén páratlan a kilátás.",
    distance: 18.0, elevation: 2505, difficulty: "Nagyon nehéz", duration: "8-9 óra",
    start_lat: 45.349, start_lon: 25.555, end_lat: 45.437, end_lon: 25.454,
    coordinates: [[45.349,25.555],[45.38,25.535],[45.41,25.51],[45.437,25.454]] as [number,number][],
    points_of_interest: [
      { name: "Omu-csúcs", lat: 45.437, lon: 25.454, description: "2505 m – a Bucegi legmagasabb pontja, meteorológiai állomás" },
      { name: "Omu menedékház", lat: 45.436, lon: 25.455, description: "Éjszakai szállás lehetséges" },
    ],
    tags: ["csúcs","magashegység","menedékház","szél","bucegi"], image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  // ─── FAGARAS ───────────────────────────────────────────────────────────────
  {
    name: "Moldoveanu-csúcs – Románia legmagasabb pontja",
    location: "Argeș megye – Fogarasi-havasok",
    description: "Románia legmagasabb csúcsa (2544 m). Hosszú, kitartást igénylő túra a Fogarasi-havasok gerincén, havasi tavakkal és lenyűgöző panorámával.",
    distance: 24.0, elevation: 2544, difficulty: "Nagyon nehéz", duration: "10-12 óra",
    start_lat: 45.601, start_lon: 24.738, end_lat: 45.601, end_lon: 24.738,
    coordinates: [[45.601,24.738],[45.61,24.72],[45.6,24.71],[45.601,24.738]] as [number,number][],
    points_of_interest: [
      { name: "Moldoveanu-csúcs", lat: 45.599, lon: 24.737, description: "2544 m – Románia legmagasabb pontja" },
      { name: "Viștea Mare", lat: 45.602, lon: 24.742, description: "2527 m, szomszédos csúcs" },
    ],
    tags: ["csúcs","gerinc","magashegység","fogaras","románia legmagasabb"], image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
  {
    name: "Bâlea-tó – Fogarasi fennsík",
    location: "Sibiu megye – Fogarasi-havasok",
    description: "A Fogarasi-havasok egyik legismertebb havasi tava (2034 m). A Transzfogarasi autóút végpontjától könnyen megközelíthető, körülötte rövid túrák a fennsíkon.",
    distance: 7.5, elevation: 400, difficulty: "Könnyű", duration: "3-4 óra",
    start_lat: 45.601, start_lon: 24.615, end_lat: 45.601, end_lon: 24.615,
    coordinates: [[45.601,24.615],[45.608,24.622],[45.604,24.63],[45.601,24.615]] as [number,number][],
    points_of_interest: [
      { name: "Bâlea-tó", lat: 45.601, lon: 24.615, description: "2034 m, havasi tó" },
      { name: "Bâlea-vízesés", lat: 45.595, lon: 24.619, description: "60 m magas vízesés" },
    ],
    tags: ["tó","vízesés","havasi","könnyű","transzfogarasi"], image_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
  {
    name: "Negoiu-csúcs",
    location: "Sibiu megye – Fogarasi-havasok",
    description: "Románia második legmagasabb csúcsa (2535 m). Sziklafalak, havasi sziklatömbök és a Serbota-tó teszik emlékezetessé ezt a kihívást.",
    distance: 20.0, elevation: 2535, difficulty: "Nagyon nehéz", duration: "10 óra",
    start_lat: 45.589, start_lon: 24.562, end_lat: 45.589, end_lon: 24.562,
    coordinates: [[45.589,24.562],[45.595,24.571],[45.589,24.562]] as [number,number][],
    points_of_interest: [
      { name: "Negoiu-csúcs", lat: 45.588, lon: 24.561, description: "2535 m, hófoltok egész évben" },
    ],
    tags: ["csúcs","szikla","magashegység","fogaras","kihívás"], image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    name: "Fogarasi-gerinc, Lacul Capra",
    location: "Argeș/Sibiu megye – Fogarasi-havasok",
    description: "A Lacul Capra (Kecske-tó) körüli körút a Fogarasi-havasok északi lejtőin. A zöldkék havasi tó és a meredek sziklafalak feledhetetlen látványt nyújtanak.",
    distance: 12.0, elevation: 1800, difficulty: "Nehéz", duration: "6 óra",
    start_lat: 45.61, start_lon: 24.69, end_lat: 45.61, end_lon: 24.69,
    coordinates: [[45.61,24.69],[45.615,24.7],[45.61,24.69]] as [number,number][],
    points_of_interest: [
      { name: "Lacul Capra", lat: 45.614, lon: 24.697, description: "Kecske-tó, havasi tó" },
    ],
    tags: ["tó","gerinc","szikla","fogaras","havasi"], image_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
  // ─── RETEZAT ───────────────────────────────────────────────────────────────
  {
    name: "Retezát – Peleaga-csúcs",
    location: "Hunedoara megye – Retezát",
    description: "A Retezát legmagasabb csúcsa (2509 m). A peleagai körút havasi tavakkal (Bucura-tó, Zănoaga), sziklafalakkal és a Retezát Nemzeti Park egyedülálló természetével.",
    distance: 21.0, elevation: 2509, difficulty: "Nagyon nehéz", duration: "10-11 óra",
    start_lat: 45.383, start_lon: 22.87, end_lat: 45.383, end_lon: 22.87,
    coordinates: [[45.383,22.87],[45.38,22.88],[45.37,22.89],[45.383,22.87]] as [number,number][],
    points_of_interest: [
      { name: "Peleaga-csúcs", lat: 45.373, lon: 22.892, description: "2509 m, Retezát legmagasabb pontja" },
      { name: "Bucura-tó", lat: 45.375, lon: 22.895, description: "Románia legnagyobb havasi tava" },
    ],
    tags: ["csúcs","havasi tó","retezát","nemzeti park","magashegység"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    name: "Bucura-tó körút",
    location: "Hunedoara megye – Retezát",
    description: "Románia legnagyobb havasi tavát (Bucura-tó) körülölelő körút a Retezát Nemzeti Parkban. A tó partján táborozási lehetőség is van.",
    distance: 15.0, elevation: 1800, difficulty: "Nehéz", duration: "7 óra",
    start_lat: 45.375, start_lon: 22.895, end_lat: 45.375, end_lon: 22.895,
    coordinates: [[45.375,22.895],[45.372,22.903],[45.375,22.895]] as [number,number][],
    points_of_interest: [
      { name: "Bucura-tó", lat: 45.375, lon: 22.895, description: "Románia legnagyobb havasi tava, 11 ha" },
      { name: "Custura Bucurei", lat: 45.373, lon: 22.897, description: "Éles sziklaél a tó felett" },
    ],
    tags: ["tó","körút","retezát","táborozás","havasi"], image_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
  {
    name: "Zănoaga-tó és Judele-csúcs",
    location: "Hunedoara megye – Retezát",
    description: "A Retezát mélyebb, vadabb része. A Zănoaga a park legmélyebb tava (29 m), a Judele-csúcsról (2398 m) páratlan rálátás a hegység tavainak sorára.",
    distance: 17.0, elevation: 2398, difficulty: "Nehéz", duration: "8 óra",
    start_lat: 45.368, start_lon: 22.905, end_lat: 45.368, end_lon: 22.905,
    coordinates: [[45.368,22.905],[45.362,22.91],[45.368,22.905]] as [number,number][],
    points_of_interest: [
      { name: "Zănoaga-tó", lat: 45.362, lon: 22.912, description: "Retezát legmélyebb tava, 29 m" },
      { name: "Judele-csúcs", lat: 45.358, lon: 22.915, description: "2398 m, panoráma a hegységre" },
    ],
    tags: ["tó","csúcs","retezát","mély","panoráma"], image_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
  // ─── PIATRA CRAIULUI ───────────────────────────────────────────────────────
  {
    name: "Királykő – teljes gerinc",
    location: "Brassó/Argeș megye – Királykő",
    description: "A Királykő (Piatra Craiului) teljes mészkőgerincének végigtúrázása (La Om 2238 m). Az egyik legszebb és leghosszabb gerinctúra Romániában, sziklafalakkal és vadvirágos rézsűkkel.",
    distance: 20.0, elevation: 2238, difficulty: "Nagyon nehéz", duration: "10 óra",
    start_lat: 45.514, start_lon: 25.225, end_lat: 45.48, end_lon: 25.22,
    coordinates: [[45.514,25.225],[45.5,25.223],[45.48,25.22]] as [number,number][],
    points_of_interest: [
      { name: "La Om csúcs", lat: 45.49, lon: 25.222, description: "2238 m, a Királykő legmagasabb pontja" },
      { name: "Curmătura menedékház", lat: 45.505, lon: 25.226, description: "Menedékház, éjszakai szállás" },
      { name: "Grind sziklapad", lat: 45.497, lon: 25.225, description: "Szédítő sziklatömb-sorozat" },
    ],
    tags: ["gerinc","mészkő","magashegység","kihívás","szikla"], image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
  {
    name: "Királykő – Curmătura menedékháztól La Om",
    location: "Brassó megye – Királykő",
    description: "A Curmătura menedékháztól a La Om csúcsig vezető gerinctúra. Meredek sziklafalak, karsztjelenségek és Románia egyik legszebb hegyvidéki kilátása.",
    distance: 13.5, elevation: 1900, difficulty: "Nehéz", duration: "7 óra",
    start_lat: 45.505, start_lon: 25.226, end_lat: 45.49, end_lon: 25.222,
    coordinates: [[45.505,25.226],[45.497,25.224],[45.49,25.222]] as [number,number][],
    points_of_interest: [
      { name: "La Om csúcs", lat: 45.49, lon: 25.222, description: "2238 m, pazar panoráma" },
    ],
    tags: ["gerinc","szikla","nehéz","csúcs","königstein"], image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  // ─── APUSENI ───────────────────────────────────────────────────────────────
  {
    name: "Vlădeasa-csúcs",
    location: "Bihor/Cluj megye – Bihar-hegység",
    description: "A Bihar-hegység legmagasabb csúcsa (1836 m). Sűrű fenyveseken és nyílt havasi réteken át vezet az út, a tetőről látható az egész Erdélyi-medence.",
    distance: 16.0, elevation: 1836, difficulty: "Közepes", duration: "6-7 óra",
    start_lat: 46.795, start_lon: 22.72, end_lat: 46.795, end_lon: 22.72,
    coordinates: [[46.795,22.72],[46.801,22.728],[46.795,22.72]] as [number,number][],
    points_of_interest: [
      { name: "Vlădeasa-csúcs", lat: 46.800, lon: 22.727, description: "1836 m, Bihar-hegység legmagasabb pontja" },
    ],
    tags: ["csúcs","fenyves","havasi rét","bihar","erdély"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    name: "Scărișoara jégbarlang és Ordânkuș",
    location: "Alba megye – Apuseni",
    description: "Európa egyik legnagyobb jégbarlangja, a Scărișoara-barlang meglátogatása az Apuseni Nemzeti Parkban. A barlangban egész évben megmaradó, hatalmas jégtömbök láthatók.",
    distance: 8.0, elevation: 300, difficulty: "Könnyű", duration: "4 óra",
    start_lat: 46.482, start_lon: 22.827, end_lat: 46.482, end_lon: 22.827,
    coordinates: [[46.482,22.827],[46.487,22.831],[46.482,22.827]] as [number,number][],
    points_of_interest: [
      { name: "Scărișoara jégbarlang", lat: 46.487, lon: 22.832, description: "Európa egyik legnagyobb jégbarlangja" },
    ],
    tags: ["barlang","jég","apuseni","könnyű","természetvédelmi"], image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    name: "Cheile Turzii – Tordai-hasadék",
    location: "Cluj megye – Apuseni",
    description: "A Tordai-hasadék (Cheile Turzii) Erdély egyik legnépszerűbb természeti látványossága. A Hasadát-patak mentén sziklafalak között vezet az ösvény, gazdag sziklamászó-útvonalakkal.",
    distance: 7.0, elevation: 250, difficulty: "Könnyű", duration: "3 óra",
    start_lat: 46.557, start_lon: 23.676, end_lat: 46.557, end_lon: 23.676,
    coordinates: [[46.557,23.676],[46.562,23.672],[46.557,23.676]] as [number,number][],
    points_of_interest: [
      { name: "Tordai-hasadék bejárata", lat: 46.558, lon: 23.675, description: "Látványos mészkősziklák" },
    ],
    tags: ["hasadék","mészkő","patak","könnyű","torda"], image_url: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
  },
  {
    name: "Cheile Vârghișului – Vargyas-szoros",
    location: "Harghita megye – Apuseni keleti pereme",
    description: "A Vargyas-szoros (Cheile Vârghișului) a Székelyföld egyik rejtett kincse. Szűk mészkőhasadékok, barlangok és a Vargyas-patak mentén vezető erdei túra.",
    distance: 9.0, elevation: 350, difficulty: "Könnyű", duration: "3-4 óra",
    start_lat: 46.198, start_lon: 25.391, end_lat: 46.198, end_lon: 25.391,
    coordinates: [[46.198,25.391],[46.202,25.385],[46.198,25.391]] as [number,number][],
    points_of_interest: [
      { name: "Vargyas-szoros", lat: 46.2, lon: 25.388, description: "Szűk mészkőhasadék és barlangok" },
    ],
    tags: ["szoros","mészkő","barlang","patak","székelyföld"], image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    name: "Muntele Mare – Gyulai-gerinc",
    location: "Cluj megye – Apuseni",
    description: "A Gyulai-gerinc (Munții Gilău-Muntele Mare) legmagasabb vonulata. Fenyvesek és havasi rétek fölött emelkedő gerinc, az Apuseni egyik legszebb panorámájával.",
    distance: 14.0, elevation: 1826, difficulty: "Közepes", duration: "6 óra",
    start_lat: 46.55, start_lon: 23.25, end_lat: 46.55, end_lon: 23.25,
    coordinates: [[46.55,23.25],[46.558,23.26],[46.55,23.25]] as [number,number][],
    points_of_interest: [
      { name: "Muntele Mare", lat: 46.556, lon: 23.259, description: "1826 m, Gyulai-hegység legmagasabb pontja" },
    ],
    tags: ["gerinc","fenyves","havasi rét","apuseni","panoráma"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  // ─── CEAHLAU ───────────────────────────────────────────────────────────────
  {
    name: "Ceahlău – Ocolașul Mare",
    location: "Neamț megye – Ceahlău",
    description: "A Ceahlău-masszívum legmagasabb csúcsa (1907 m). A moldvai hegyvidék ikonikus hegye, különleges bazalt sziklaformációkkal (Toaca, Panaghia). Vallási zarándoklatok célpontja is.",
    distance: 16.0, elevation: 1907, difficulty: "Közepes", duration: "7 óra",
    start_lat: 46.909, start_lon: 25.926, end_lat: 46.909, end_lon: 25.926,
    coordinates: [[46.909,25.926],[46.916,25.93],[46.909,25.926]] as [number,number][],
    points_of_interest: [
      { name: "Ocolașul Mare", lat: 46.915, lon: 25.929, description: "1907 m, Ceahlău legmagasabb csúcsa" },
      { name: "Toaca-csúcs", lat: 46.918, lon: 25.935, description: "Meteorológiai állomás, karakteres sziklaformáció" },
    ],
    tags: ["csúcs","sziklaformáció","moldva","ceahlău","zarándoklat"], image_url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  },
  {
    name: "Ceahlău – Duruitoarea-vízesés",
    location: "Neamț megye – Ceahlău",
    description: "Románia egyik legszebb vízeséséhez, a Duruitoarehoz vezető könnyű erdei túra. A sziklakapu alatt zubogó vízesés a Ceahlău lábánál nyit látványos látképet.",
    distance: 6.0, elevation: 400, difficulty: "Könnyű", duration: "2-3 óra",
    start_lat: 46.908, start_lon: 25.918, end_lat: 46.908, end_lon: 25.918,
    coordinates: [[46.908,25.918],[46.912,25.921],[46.908,25.918]] as [number,number][],
    points_of_interest: [
      { name: "Duruitoarea-vízesés", lat: 46.912, lon: 25.922, description: "Románia egyik legszebb esése" },
    ],
    tags: ["vízesés","erdő","könnyű","ceahlău","patak"], image_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
  // ─── CIUCAS ────────────────────────────────────────────────────────────────
  {
    name: "Ciucaș – Tigăile Mari",
    location: "Prahova megye – Ciucaș",
    description: "A Ciucaș vulkanikus csúcs (1961 m) legkalandosabb útvonala a Tigăile Mari sziklaoszlopokon át. Különleges sziklatornyok és sziklás meredekek teszik emlékezetessé.",
    distance: 14.5, elevation: 1961, difficulty: "Nehéz", duration: "6-7 óra",
    start_lat: 45.516, start_lon: 26.068, end_lat: 45.516, end_lon: 26.068,
    coordinates: [[45.516,26.068],[45.507,26.073],[45.516,26.068]] as [number,number][],
    points_of_interest: [
      { name: "Ciucaș-csúcs", lat: 45.503, lon: 26.076, description: "1961 m" },
      { name: "Tigăile Mari", lat: 45.505, lon: 26.071, description: "Bazaltos sziklaoszlopok" },
    ],
    tags: ["sziklaoszlop","vulkáni","csúcs","nehéz","ciucaș"], image_url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  },
  {
    name: "Ciucaș – Bratocea-hágó körút",
    location: "Prahova/Covasna megye – Ciucaș",
    description: "Körút a Bratocea-hágóról a Ciucaș masszívum főbb csúcsain át. Vegyes terep, szép panoráma a Ciucaș-völgyére és a Brassói-medencére.",
    distance: 11.5, elevation: 1100, difficulty: "Közepes", duration: "5 óra",
    start_lat: 45.561, start_lon: 25.994, end_lat: 45.561, end_lon: 25.994,
    coordinates: [[45.561,25.994],[45.54,26.03],[45.561,25.994]] as [number,number][],
    points_of_interest: [
      { name: "Bratocea-hágó", lat: 45.561, lon: 25.994, description: "1263 m, Prahova–Covasna határ" },
    ],
    tags: ["körút","közepes","hágó","erdő","ciucaș"], image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  // ─── CHEILE BICAZULUI – HASMAS ─────────────────────────────────────────────
  {
    name: "Cheile Bicazului – Bicaz-szoros",
    location: "Neamț/Harghita megye – Hășmaș",
    description: "Románia egyik leglátványosabb mészkőszorosa. A szűk, 300 m magas sziklafalak között vezető ösvény és az autóút mentén elhelyezkedő boltok, porcelán árulók is jellemzik.",
    distance: 6.0, elevation: 300, difficulty: "Könnyű", duration: "2-3 óra",
    start_lat: 46.793, start_lon: 25.984, end_lat: 46.793, end_lon: 25.984,
    coordinates: [[46.793,25.984],[46.8,25.981],[46.793,25.984]] as [number,number][],
    points_of_interest: [
      { name: "Bicaz-szoros szűkülete", lat: 46.798, lon: 25.982, description: "300 m magas sziklafalak" },
    ],
    tags: ["szoros","mészkő","szikla","könnyű","bicaz"], image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    name: "Lacul Roșu – Gyilkos-tó körút",
    location: "Harghita megye – Hășmaș",
    description: "A Gyilkos-tó (Lacul Roșu) körüli erdei körút, a Hasmas-hegység lábánál. Az 1838-ban keletkezett természetes kőzetgát által felduzzasztott tóban holtfa-csonkok meredeznek ki a vízből.",
    distance: 5.5, elevation: 150, difficulty: "Könnyű", duration: "2 óra",
    start_lat: 46.789, start_lon: 25.948, end_lat: 46.789, end_lon: 25.948,
    coordinates: [[46.789,25.948],[46.793,25.953],[46.789,25.948]] as [number,number][],
    points_of_interest: [
      { name: "Lacul Roșu (Gyilkos-tó)", lat: 46.791, lon: 25.952, description: "Természetes duzzasztóval keletkezett hegyi tó" },
    ],
    tags: ["tó","körút","könnyű","hasmas","holtfa"], image_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
  {
    name: "Hășmașul Mare – Nagy-Hagymas",
    location: "Harghita megye – Hășmaș",
    description: "A Hășmașul Mare (Nagy-Hagymas, 1792 m) a Hasmaș-Cheile Bicazului Nemzeti Park legmagasabb pontja. A csúcsról fantasztikus rálátás a Gyilkos-tóra és a Bicaz-szoros sziklafalaira.",
    distance: 13.0, elevation: 1792, difficulty: "Közepes", duration: "6 óra",
    start_lat: 46.791, start_lon: 25.952, end_lat: 46.791, end_lon: 25.952,
    coordinates: [[46.791,25.952],[46.798,25.96],[46.791,25.952]] as [number,number][],
    points_of_interest: [
      { name: "Hășmașul Mare", lat: 46.797, lon: 25.962, description: "1792 m, panoráma a Gyilkos-tóra" },
    ],
    tags: ["csúcs","panoráma","hasmas","tó","közepes"], image_url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  },
  // ─── RARAU – STÂNISOARA ────────────────────────────────────────────────────
  {
    name: "Rarău – Pietrele Doamnei",
    location: "Suceava megye – Rarău",
    description: "A Rarău legfeltűnőbb sziklaképződménye, a Pietrele Doamnei ('Az úrnő kövei') grandiózus mészkősziklatornyai. A Rarău-menedékháztól gyalog egy óra alatt elérhető.",
    distance: 8.0, elevation: 500, difficulty: "Könnyű", duration: "3-4 óra",
    start_lat: 47.451, start_lon: 25.592, end_lat: 47.451, end_lon: 25.592,
    coordinates: [[47.451,25.592],[47.456,25.598],[47.451,25.592]] as [number,number][],
    points_of_interest: [
      { name: "Pietrele Doamnei", lat: 47.455, lon: 25.597, description: "Látványos mészkősziklatornyok" },
    ],
    tags: ["sziklák","mészkő","könnyű","rarău","észak-moldva"], image_url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  },
  {
    name: "Giumalău-csúcs",
    location: "Suceava megye – Stânișoara",
    description: "A Giumalău (1857 m) és az egész Stânișoara-hegység legmagasabb csúcsa. Az erdős lejtőkön átvezetõ hosszú, de jutalmasan szép túra a bukoviai hegyvidéken.",
    distance: 18.0, elevation: 1857, difficulty: "Közepes", duration: "7-8 óra",
    start_lat: 47.302, start_lon: 25.682, end_lat: 47.302, end_lon: 25.682,
    coordinates: [[47.302,25.682],[47.311,25.688],[47.302,25.682]] as [number,number][],
    points_of_interest: [
      { name: "Giumalău-csúcs", lat: 47.311, lon: 25.689, description: "1857 m, Bukovina legmagasabb pontja" },
    ],
    tags: ["csúcs","erdő","bukovina","közepes","stânișoara"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  // ─── POSTAVARU – PIATRA MARE ───────────────────────────────────────────────
  {
    name: "Nagykőhavas (Piatra Mare) – teljes körút",
    location: "Brassó megye – Nagykőhavas",
    description: "A Nagykőhavas (Piatra Mare, 1843 m) teljes körúttúrája Brassótól. Sziklás gerincen, fenyvesek között vezet, a tetőről pazar kilátás Brassóra és a Déli-Kárpátokra.",
    distance: 14.5, elevation: 1843, difficulty: "Nehéz", duration: "6-7 óra",
    start_lat: 45.591, start_lon: 25.598, end_lat: 45.591, end_lon: 25.598,
    coordinates: [[45.591,25.598],[45.584,25.622],[45.591,25.598]] as [number,number][],
    points_of_interest: [
      { name: "Piatra Mare csúcs", lat: 45.582, lon: 25.625, description: "1843 m, panoráma Brassóra" },
    ],
    tags: ["csúcs","körút","brassó","fenyves","panoráma"], image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    name: "Postavaru-csúcs és Poiana Brasov",
    location: "Brassó megye – Postavaru",
    description: "A Poiana Brasov sídombokról a Postavaru-csúcsra (1799 m) vezető könnyű–közepes kirándulás. A csúcsról Brassó és a Kárpátok lenyűgöző panorámája tárul ki.",
    distance: 9.0, elevation: 800, difficulty: "Közepes", duration: "4 óra",
    start_lat: 45.591, start_lon: 25.562, end_lat: 45.591, end_lon: 25.562,
    coordinates: [[45.591,25.562],[45.597,25.57],[45.591,25.562]] as [number,number][],
    points_of_interest: [
      { name: "Postavaru-csúcs", lat: 45.596, lon: 25.569, description: "1799 m, kilátó" },
    ],
    tags: ["csúcs","közepes","brassó","sípark","panoráma"], image_url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  },
  // ─── CALIMANI ──────────────────────────────────────────────────────────────
  {
    name: "Pietrosul Călimanilor – Kelet-Kárpátok legmagasabb csúcsa",
    location: "Mureș/Suceava megye – Călimanilor",
    description: "A Keleti-Kárpátok legnagyobb vulkáni csúcsa (2100 m). A Călimanilor Nemzeti Parkban, kénkibocsátó területeken, különleges vulkáni formációk között vezet az út.",
    distance: 20.0, elevation: 2100, difficulty: "Nehéz", duration: "9 óra",
    start_lat: 47.115, start_lon: 25.04, end_lat: 47.115, end_lon: 25.04,
    coordinates: [[47.115,25.04],[47.122,25.048],[47.115,25.04]] as [number,number][],
    points_of_interest: [
      { name: "Pietrosul Călimanilor", lat: 47.121, lon: 25.047, description: "2100 m, kelet-kárpátok legmagasabb vulkáni csúcsa" },
    ],
    tags: ["vulkán","csúcs","magashegység","calimani","nemzeti park"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    name: "Călimanilor – Kén-völgy",
    location: "Mureș megye – Călimanilor",
    description: "A Călimanilor vulkáni kén-völgye, ahol a talaj repedéseiből kén-dioxid áramlik fel. A táj holdbéli, kísérteties, de lenyűgöző vulkáni hatásról tanúskodik.",
    distance: 10.0, elevation: 600, difficulty: "Közepes", duration: "4-5 óra",
    start_lat: 47.101, start_lon: 25.052, end_lat: 47.101, end_lon: 25.052,
    coordinates: [[47.101,25.052],[47.108,25.058],[47.101,25.052]] as [number,number][],
    points_of_interest: [
      { name: "Kén-völgy", lat: 47.107, lon: 25.057, description: "Vulkáni kén-dioxid kibocsátás" },
    ],
    tags: ["vulkán","kén","különleges","közepes","calimani"], image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  // ─── METALIFERI – TRASCAU ──────────────────────────────────────────────────
  {
    name: "Trascău – Rimetea (Torockó) körút",
    location: "Alba megye – Trascăului",
    description: "Torockó (Rimetea) festői falujából induló körút a Trascău-hegység mészkőszikláira. A falutól a Piatra Secuiului sziklás gerincéig vezet az út, Székelyföld egyik legszebb kirándulópontja.",
    distance: 8.5, elevation: 550, difficulty: "Közepes", duration: "3-4 óra",
    start_lat: 46.445, start_lon: 23.579, end_lat: 46.445, end_lon: 23.579,
    coordinates: [[46.445,23.579],[46.451,23.585],[46.445,23.579]] as [number,number][],
    points_of_interest: [
      { name: "Piatra Secuiului", lat: 46.45, lon: 23.583, description: "Mészkőgerinc, panoráma Torockóra" },
      { name: "Rimetea (Torockó)", lat: 46.445, lon: 23.579, description: "Egyik legjobban megőrzött székely falu" },
    ],
    tags: ["mészkő","gerinc","szász-falu","körút","torockó"], image_url: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
  },
  {
    name: "Cheile Râmețului – Rámeti-szoros",
    location: "Alba megye – Trascău",
    description: "A Râmeț-patak vájta szűk mészkőszoros, ahol a falak helyenként csak néhány méter szélesre szorulnak. A szoros végén az egyik legrégibb erdélyi kolostort találjuk.",
    distance: 7.0, elevation: 280, difficulty: "Könnyű", duration: "3 óra",
    start_lat: 46.356, start_lon: 23.55, end_lat: 46.356, end_lon: 23.55,
    coordinates: [[46.356,23.55],[46.362,23.547],[46.356,23.55]] as [number,number][],
    points_of_interest: [
      { name: "Rámeti-szoros szűkülete", lat: 46.36, lon: 23.548, description: "Néhány méter széles mészkőhasadék" },
      { name: "Rámeti kolostor", lat: 46.357, lon: 23.55, description: "14. századi ortodox kolostor" },
    ],
    tags: ["szoros","mészkő","kolostor","könnyű","patak"], image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  // ─── BANAT – CHEILE NEREI ──────────────────────────────────────────────────
  {
    name: "Cheile Nerei – Nera-szoros",
    location: "Caraș-Severin megye – Banat",
    description: "Románia leghosszabb és legmélyebb szorosa (22 km). A Nera-szoros sziklaszivárgásokkal, kanyargó patakkal és mediterrán mikroklímájú erdőkkel Románia egyik legszebb természeti csodája.",
    distance: 22.0, elevation: 600, difficulty: "Nehéz", duration: "8-9 óra",
    start_lat: 44.862, start_lon: 21.851, end_lat: 44.862, end_lon: 21.851,
    coordinates: [[44.862,21.851],[44.87,21.87],[44.862,21.851]] as [number,number][],
    points_of_interest: [
      { name: "Nera-szoros", lat: 44.868, lon: 21.858, description: "Románia leghosszabb szorosa" },
      { name: "Sfinxul Bănățean", lat: 44.872, lon: 21.865, description: "Banáti Szfinx sziklaformáció" },
    ],
    tags: ["szoros","patak","mediterrán","nehéz","banat"], image_url: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
  },
  {
    name: "Semenic-fennsík körút",
    location: "Caraș-Severin megye – Semenic",
    description: "A Semenic-fennsík erdős magaslatain vezető körút. A Semenic-csúcs (1447 m) az egész Banáti Kárpátok legmagasabb pontja, körülötte hatalmas bükkerdők és havasi rétek.",
    distance: 12.0, elevation: 1447, difficulty: "Közepes", duration: "5 óra",
    start_lat: 45.174, start_lon: 22.064, end_lat: 45.174, end_lon: 22.064,
    coordinates: [[45.174,22.064],[45.181,22.071],[45.174,22.064]] as [number,number][],
    points_of_interest: [
      { name: "Semenic-csúcs", lat: 45.18, lon: 22.07, description: "1447 m, Banáti-Kárpátok legmagasabb pontja" },
    ],
    tags: ["fennsík","bükkerdő","körút","közepes","banat"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  // ─── DOBROGEA – DELTA ──────────────────────────────────────────────────────
  {
    name: "Munții Măcinului – Tulucea",
    location: "Tulcea megye – Dobrudzsa",
    description: "Románia egyik legrégibb hegyeinek (Măcin-hegység) átjárása. Mediterrán sztyepék, gránit sziklaformációk és herpetológiai gazdagság jellemzik ezt az egyedülálló területet.",
    distance: 10.5, elevation: 467, difficulty: "Könnyű", duration: "4 óra",
    start_lat: 45.258, start_lon: 28.121, end_lat: 45.258, end_lon: 28.121,
    coordinates: [[45.258,28.121],[45.265,28.128],[45.258,28.121]] as [number,number][],
    points_of_interest: [
      { name: "Greci-csúcs", lat: 45.264, lon: 28.127, description: "467 m, Măcin legmagasabb csúcsa" },
    ],
    tags: ["mediterrán","sztyep","gránit","könnyű","dobrudzsa"], image_url: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
  },
  // ─── HATEG BASIN SURROUNDINGS ──────────────────────────────────────────────
  {
    name: "Șureanu – Dacikus erőd és csúcs",
    location: "Hunedoara megye – Szuriáni-havasok",
    description: "A Szuriáni-havasok legmagasabb csúcsa (2130 m) és a közelében lévő Sarmizegetusa Regia dacikus erőd maradványai egyszerre kulturális és természeti kihívást nyújtanak.",
    distance: 19.0, elevation: 2130, difficulty: "Nehéz", duration: "8 óra",
    start_lat: 45.61, start_lon: 23.33, end_lat: 45.61, end_lon: 23.33,
    coordinates: [[45.61,23.33],[45.618,23.338],[45.61,23.33]] as [number,number][],
    points_of_interest: [
      { name: "Șureanu-csúcs", lat: 45.617, lon: 23.337, description: "2130 m, Szuriáni-havasok legmagasabb csúcsa" },
      { name: "Sarmizegetusa Regia", lat: 45.621, lon: 23.327, description: "A dák királyság fővárosa és templomainak romjai" },
    ],
    tags: ["csúcs","történelem","dacikus","nehéz","hunedoara"], image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  // ─── NORTHERN MOLDAVIA – SUCEVITA ──────────────────────────────────────────
  {
    name: "Obcinele Bucovinei – Obcina Feredeu",
    location: "Suceava megye – Bukovina",
    description: "A bukovai Obcinele hegyvonulat szelíd dombjai között vezető erdei túra. A gerinc mentén szebbnél szebb bükkerdők és havasi kaszálók váltják egymást.",
    distance: 11.0, elevation: 1350, difficulty: "Könnyű", duration: "4-5 óra",
    start_lat: 47.802, start_lon: 25.201, end_lat: 47.802, end_lon: 25.201,
    coordinates: [[47.802,25.201],[47.808,25.209],[47.802,25.201]] as [number,number][],
    points_of_interest: [
      { name: "Obcina Feredeu teteje", lat: 47.807, lon: 25.208, description: "1350 m, bükkerdős gerinc" },
    ],
    tags: ["erdő","gerinc","könnyű","bukovina","bükkös"], image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  // ─── HUNEDOARA – POIANA RUSCA ──────────────────────────────────────────────
  {
    name: "Poiana Ruscă – Padeș körút",
    location: "Hunedoara megye – Poiana Ruscă",
    description: "A kevésbé ismert Poiana Ruscă-hegység fenyvesein és rétjein átívelő körút. Csendes, tömegturizmustól mentes tájak, kristálytiszta patakok és gazdag madárvilág.",
    distance: 13.0, elevation: 1374, difficulty: "Közepes", duration: "5-6 óra",
    start_lat: 45.695, start_lon: 22.508, end_lat: 45.695, end_lon: 22.508,
    coordinates: [[45.695,22.508],[45.701,22.515],[45.695,22.508]] as [number,number][],
    points_of_interest: [
      { name: "Padeș-csúcs", lat: 45.7, lon: 22.514, description: "1374 m, Poiana Ruscă legmagasabb pontja" },
    ],
    tags: ["fenyves","rét","patak","madárvilág","közepes"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  // ─── SOUTHERN CARPATHIANS EXTRAS ───────────────────────────────────────────
  {
    name: "Parâng – Cindrel traverse",
    location: "Gorj/Sibiu megye – Parâng–Cindrel",
    description: "A Parâng (2519 m) csúcsától a Szebeni-havasokig vezető masszív gerinctúra. Román hegyisétákra ritka, kétnapos gerinctúra, éjszakázással a Parâng-menedékházban.",
    distance: 28.0, elevation: 2519, difficulty: "Nagyon nehéz", duration: "2 nap",
    start_lat: 45.342, start_lon: 23.56, end_lat: 45.625, end_lon: 23.875,
    coordinates: [[45.342,23.56],[45.45,23.7],[45.625,23.875]] as [number,number][],
    points_of_interest: [
      { name: "Parângul Mare", lat: 45.341, lon: 23.558, description: "2519 m, Parâng-hegység csúcsa" },
      { name: "Parâng menedékház", lat: 45.36, lon: 23.59, description: "Éjszakai pihenő" },
    ],
    tags: ["gerinc","magashegység","többnapos","kihívás","parâng"], image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
  {
    name: "Godeanul-csúcs – Godeanu-hegység",
    location: "Gorj/Caraș-Severin megye – Godeanu",
    description: "A Godeanu-hegység legmagasabb pontja (2229 m), az egyik legritkábban látogatott magashegységi csúcs Romániában. Vadregényes, érintetlen táj, gazdag állat- és növényvilággal.",
    distance: 18.0, elevation: 2229, difficulty: "Nagyon nehéz", duration: "9 óra",
    start_lat: 45.105, start_lon: 22.688, end_lat: 45.105, end_lon: 22.688,
    coordinates: [[45.105,22.688],[45.111,22.695],[45.105,22.688]] as [number,number][],
    points_of_interest: [
      { name: "Godeanul-csúcs", lat: 45.11, lon: 22.694, description: "2229 m, vadregényes csúcs" },
    ],
    tags: ["csúcs","érintetlen","magashegység","nehéz","godeanu"], image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    name: "Domogled-csúcs – Meleg-forrás völgye",
    location: "Caraș-Severin/Mehedinți megye – Domogled",
    description: "A Domogled-Cerna-völgy Nemzeti Park egyedülálló mediterrán flórájú hegyei. A Domogled-csúcsról (1105 m) a Herkulesfürdő (Băile Herculane) és a Cerna-völgy páratlan panorámája tárul fel.",
    distance: 9.5, elevation: 1105, difficulty: "Közepes", duration: "4 óra",
    start_lat: 44.878, start_lon: 22.408, end_lat: 44.878, end_lon: 22.408,
    coordinates: [[44.878,22.408],[44.884,22.415],[44.878,22.408]] as [number,number][],
    points_of_interest: [
      { name: "Domogled-csúcs", lat: 44.883, lon: 22.414, description: "1105 m, mediterrán flóra" },
      { name: "Herkulesfürdő (Băile Herculane)", lat: 44.878, lon: 22.412, description: "Termalfürdő a Cerna-völgyön" },
    ],
    tags: ["mediterrán","csúcs","termalfürdő","közepes","cerna-völgy"], image_url: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
  },
  {
    name: "Capatânii – Buila-Vânturărița Nemzeti Park",
    location: "Vâlcea megye – Căpățânii",
    description: "A Buila-Vânturărița sziklafalrendszer a Căpățânii-hegységben. A függőleges mészkőfalak, barlangok és havasi legelők egyedülálló kombinációja.",
    distance: 15.0, elevation: 1885, difficulty: "Nehéz", duration: "7 óra",
    start_lat: 45.239, start_lon: 23.807, end_lat: 45.239, end_lon: 23.807,
    coordinates: [[45.239,23.807],[45.246,23.815],[45.239,23.807]] as [number,number][],
    points_of_interest: [
      { name: "Vânturărița Mare", lat: 45.245, lon: 23.814, description: "1885 m, sziklafalak és barlangok" },
    ],
    tags: ["sziklafalak","barlang","havasi rét","nehéz","vâlcea"], image_url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  },
  // ─── NORTHWESTERN CARPATHIANS ──────────────────────────────────────────────
  {
    name: "Igniș-csúcs – Máramaros",
    location: "Maramureș megye – Igniș",
    description: "A Máramaros-hegység (Munții Igniș) legmagasabb csúcsa (1307 m). A bányaváros Baia Mare melletti hegyekből páratlan kilátás az Iza- és Máramaros-völgyekre.",
    distance: 9.0, elevation: 1307, difficulty: "Közepes", duration: "4 óra",
    start_lat: 47.678, start_lon: 23.718, end_lat: 47.678, end_lon: 23.718,
    coordinates: [[47.678,23.718],[47.684,23.724],[47.678,23.718]] as [number,number][],
    points_of_interest: [
      { name: "Igniș-csúcs", lat: 47.683, lon: 23.723, description: "1307 m, Máramaros panoráma" },
    ],
    tags: ["csúcs","közepes","máramaros","panoráma","bányaváros"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    name: "Gutâi-hágó és Pop Ivan",
    location: "Maramureș megye – Gutâi",
    description: "A Gutâi-hágóról (987 m) a Pop Ivan (1309 m) csúcsra vezető gerinctúra. Sűrű bükkerdők, szép rétek és a Kővár-vidék festői tájképe kíséri az utat.",
    distance: 11.0, elevation: 1309, difficulty: "Közepes", duration: "5 óra",
    start_lat: 47.721, start_lon: 23.588, end_lat: 47.721, end_lon: 23.588,
    coordinates: [[47.721,23.588],[47.727,23.595],[47.721,23.588]] as [number,number][],
    points_of_interest: [
      { name: "Pop Ivan csúcs", lat: 47.726, lon: 23.594, description: "1309 m, kilátás a Kővár-vidékre" },
    ],
    tags: ["gerinc","bükkerdő","közepes","máramaros","gutâi"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    name: "Rodnai-havasok – Pietrosul Mare",
    location: "Maramureș/Bistrița-Năsăud megye – Rodnai-havasok",
    description: "Az Erdélyi-Kárpátok legnagyobb magashegységi rezervátuma. Pietrosul Mare (2303 m) csúcsa örökjégfoltokkal, havasi tavakkal és sziklafalakkal lenyűgöző élményt nyújt.",
    distance: 22.0, elevation: 2303, difficulty: "Nagyon nehéz", duration: "10 óra",
    start_lat: 47.598, start_lon: 24.635, end_lat: 47.598, end_lon: 24.635,
    coordinates: [[47.598,24.635],[47.605,24.643],[47.598,24.635]] as [number,number][],
    points_of_interest: [
      { name: "Pietrosul Mare", lat: 47.604, lon: 24.642, description: "2303 m, Rodnai-havasok legmagasabb csúcsa" },
      { name: "Lala-tó", lat: 47.602, lon: 24.639, description: "Havasi tó, rezervátum" },
    ],
    tags: ["csúcs","havasi tó","magashegység","rodnai","rezervátum"], image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  },
  {
    name: "Ineu-csúcs – Rodnai-havasok",
    location: "Bistrița-Năsăud megye – Rodnai-havasok",
    description: "Az Ineu-csúcs (2279 m) megközelítése a Borșa-Resort oldaláról. A gerinctúra a Pietrosul Mare szomszédságában vezet, havasi tavak és örökzöld fenyvesek közepette.",
    distance: 18.0, elevation: 2279, difficulty: "Nehéz", duration: "8 óra",
    start_lat: 47.617, start_lon: 24.652, end_lat: 47.617, end_lon: 24.652,
    coordinates: [[47.617,24.652],[47.622,24.659],[47.617,24.652]] as [number,number][],
    points_of_interest: [
      { name: "Ineu-csúcs", lat: 47.621, lon: 24.658, description: "2279 m" },
    ],
    tags: ["csúcs","gerinc","magashegység","nehéz","rodnai"], image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  // ─── MISCELLANEOUS ─────────────────────────────────────────────────────────
  {
    name: "Suseni-vízesés – Szebeni-havasok",
    location: "Sibiu megye – Szebeni-havasok",
    description: "A Szebeni-havasok egyik legszebb vízesése a Suseni-patak mentén. Az erdős szurdok és a lépcsős vízesések sorozata különösen tavasszal és ősszel festői.",
    distance: 7.0, elevation: 400, difficulty: "Könnyű", duration: "3 óra",
    start_lat: 45.683, start_lon: 23.921, end_lat: 45.683, end_lon: 23.921,
    coordinates: [[45.683,23.921],[45.689,23.927],[45.683,23.921]] as [number,number][],
    points_of_interest: [
      { name: "Suseni-vízesés", lat: 45.688, lon: 23.926, description: "Lépcsős vízeséssor" },
    ],
    tags: ["vízesés","erdő","könnyű","szebeni","tavaszi"], image_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
  {
    name: "Cheile Oltului – Olt-szoros",
    location: "Covasna/Brașov megye – Olt-szoros",
    description: "Az Olt-folyó szurdokában vezető spektakuláris túra, ahol a vasúti alagút mellett sziklás ösvényen haladunk. A szoros mindkét oldalán százméter magas sziklafalak tornyosulnak.",
    distance: 12.0, elevation: 350, difficulty: "Közepes", duration: "5 óra",
    start_lat: 45.697, start_lon: 25.583, end_lat: 45.697, end_lon: 25.583,
    coordinates: [[45.697,25.583],[45.703,25.589],[45.697,25.583]] as [number,number][],
    points_of_interest: [
      { name: "Olt-szoros legszűkebb pontja", lat: 45.702, lon: 25.588, description: "100 m magas sziklafalak" },
    ],
    tags: ["szoros","folyó","szikla","vasút","közepes"], image_url: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80",
  },
  {
    name: "Bicajul Ardelean – Vadállás erdő",
    location: "Bistrița-Năsăud megye",
    description: "Romanticul ținut al Văii Bistrița, prin păduri seculare de fag și conifere spre vârful Bichigiu (1438 m). Peisaje tipice transilvănene, liniştite şi reconfortante.",
    distance: 11.0, elevation: 1438, difficulty: "Közepes", duration: "5 óra",
    start_lat: 47.05, start_lon: 24.802, end_lat: 47.05, end_lon: 24.802,
    coordinates: [[47.05,24.802],[47.056,24.809],[47.05,24.802]] as [number,number][],
    points_of_interest: [
      { name: "Bichigiu-csúcs", lat: 47.055, lon: 24.808, description: "1438 m, bükkös csúcs" },
    ],
    tags: ["bükkerdő","csúcs","közepes","bistrița-năsăud","csendes"], image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    name: "Cindrel – Iezerul Mare",
    location: "Sibiu megye – Szebeni-havasok",
    description: "A Cindrel-csúcstól (2244 m) a Iezerul Mare-tóig vezető körút, a Szebeni-havasok legszebb szakaszán. Havasi legelők, kristálytiszta forrásokból táplált tavak és kőtengerek váltakoznak.",
    distance: 16.0, elevation: 2244, difficulty: "Nehéz", duration: "7-8 óra",
    start_lat: 45.622, start_lon: 23.851, end_lat: 45.622, end_lon: 23.851,
    coordinates: [[45.622,23.851],[45.628,23.858],[45.622,23.851]] as [number,number][],
    points_of_interest: [
      { name: "Cindrel-csúcs", lat: 45.627, lon: 23.857, description: "2244 m" },
      { name: "Iezerul Mare", lat: 45.624, lon: 23.853, description: "Havasi tó a gerinc alatt" },
    ],
    tags: ["csúcs","tó","havasi legelő","szebeni","nehéz"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    name: "Apuseni – Padis-fennsík körút",
    location: "Bihor megye – Apuseni",
    description: "A Padis-fennsík (1282 m) az Apuseni egyik leglenyűgözőbb területe: dolinen, barlangokon, víznyelőkön és havasi legelőkön át vezet a kör. A Cetățile Ponorului barlangrendszer is útba esik.",
    distance: 12.5, elevation: 600, difficulty: "Közepes", duration: "5-6 óra",
    start_lat: 46.668, start_lon: 22.694, end_lat: 46.668, end_lon: 22.694,
    coordinates: [[46.668,22.694],[46.675,22.7],[46.668,22.694]] as [number,number][],
    points_of_interest: [
      { name: "Cetățile Ponorului", lat: 46.672, lon: 22.698, description: "Románia egyik legnagyobb barlangjárata" },
      { name: "Padis-fennsík", lat: 46.668, lon: 22.694, description: "1282 m, karsztos fennsík" },
    ],
    tags: ["karszt","barlang","fennsík","körút","apuseni"], image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    name: "Lacul Sf. Ana – Szt. Anna-tó körút",
    location: "Harghita megye – Bodoc-hegység",
    description: "Kelet-Európa egyetlen vulkáni krátertava, a Szt. Anna-tó körüli erdei sétaút. A kráter oldalain bükkösök, belül a tó partján nyugalmas ösvény vezet.",
    distance: 5.0, elevation: 100, difficulty: "Könnyű", duration: "1.5 óra",
    start_lat: 46.109, start_lon: 25.881, end_lat: 46.109, end_lon: 25.881,
    coordinates: [[46.109,25.881],[46.112,25.885],[46.109,25.881]] as [number,number][],
    points_of_interest: [
      { name: "Szt. Anna-tó", lat: 46.11, lon: 25.882, description: "Vulkáni krátertó, kelet-európai egyedüliség" },
    ],
    tags: ["vulkán","krátertó","könnyű","székelyföld","természetvédelem"], image_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
  {
    name: "Nemira-hegység – Sândominic feletti körút",
    location: "Harghita megye – Nemira",
    description: "A Nemira-hegység tűlevelű erdein és havasi legelőin át vezető körút Sândominic (Csíkszentdomokos) közeléből. A Nemira-csúcsról (1649 m) Csíkszereda és a Csíki-medence panorámája.",
    distance: 13.0, elevation: 1649, difficulty: "Közepes", duration: "5-6 óra",
    start_lat: 46.523, start_lon: 25.891, end_lat: 46.523, end_lon: 25.891,
    coordinates: [[46.523,25.891],[46.529,25.898],[46.523,25.891]] as [number,number][],
    points_of_interest: [
      { name: "Nemira-csúcs", lat: 46.528, lon: 25.897, description: "1649 m, panoráma Csíki-medencére" },
    ],
    tags: ["csúcs","fenyves","körút","csíkszereda","közepes"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    name: "Harghita Mădăraș – Harghita Bai",
    location: "Harghita megye – Hargita",
    description: "A Hargita-hegység legmagasabb pontja (1801 m) a Harghita Mădăraș csúcs. A körút vulkáni kráterekon, tőzegmocsarakon és havasi tavakon át vezet, Románia egyik leggazdagabb természeti területén.",
    distance: 10.5, elevation: 1801, difficulty: "Közepes", duration: "5 óra",
    start_lat: 46.376, start_lon: 25.609, end_lat: 46.376, end_lon: 25.609,
    coordinates: [[46.376,25.609],[46.382,25.616],[46.376,25.609]] as [number,number][],
    points_of_interest: [
      { name: "Harghita Mădăraș", lat: 46.381, lon: 25.615, description: "1801 m, legmagasabb pont" },
      { name: "Tőzegmohás tó", lat: 46.379, lon: 25.612, description: "Vulkáni krátertó" },
    ],
    tags: ["vulkán","tőzeglap","csúcs","közepes","hargita"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    name: "Bodoc-hegység – Balvanyos körút",
    location: "Covasna megye – Bodoc",
    description: "A Balvanyos (Bálványosfürdő) gyógyvíz-forrásai mellől induló körút a Bodoc-hegységben. Természetes ásványvíz-forrásokkal, büdösbarlangokkal és erdős tetőkkel.",
    distance: 8.0, elevation: 550, difficulty: "Könnyű", duration: "3-4 óra",
    start_lat: 46.046, start_lon: 25.917, end_lat: 46.046, end_lon: 25.917,
    coordinates: [[46.046,25.917],[46.051,25.923],[46.046,25.917]] as [number,number][],
    points_of_interest: [
      { name: "Büdösbarlang", lat: 46.05, lon: 25.921, description: "Kén-dioxid kibocsátású természetes barlang" },
      { name: "Bálványosfürdő forrásai", lat: 46.046, lon: 25.918, description: "Ásványvíz-források" },
    ],
    tags: ["ásványvíz","barlang","erdő","könnyű","covasna"], image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    name: "Breaza – Szinaia felett",
    location: "Prahova megye",
    description: "Szinaja városától érintetlen fenyveseken vezet az út a Breaza-tetőre. Könnyen megközelíthető, mégis csendes erdei túra, amelyről Szinaja villáinak és a Bucegi falának páratlan kilátása nyílik.",
    distance: 8.5, elevation: 600, difficulty: "Könnyű", duration: "3-4 óra",
    start_lat: 45.358, start_lon: 25.555, end_lat: 45.358, end_lon: 25.555,
    coordinates: [[45.358,25.555],[45.364,25.561],[45.358,25.555]] as [number,number][],
    points_of_interest: [
      { name: "Breaza tető", lat: 45.363, lon: 25.56, description: "Fenyves, kilátás Szinajára" },
    ],
    tags: ["fenyves","könnyű","szinaia","panoráma","prahova"], image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
  },
  {
    name: "Cheile Bicazului – Lacul Roșu kör",
    location: "Harghita/Neamț megye – Hășmaș",
    description: "Összekötött körút a Bicaz-szoros és a Gyilkos-tó között. Az autóúton és az erdei ösvényen is járható, kombinálja a szoros fenséges sziklafalait és a tó különleges élővilágát.",
    distance: 14.0, elevation: 550, difficulty: "Közepes", duration: "5-6 óra",
    start_lat: 46.793, start_lon: 25.984, end_lat: 46.793, end_lon: 25.984,
    coordinates: [[46.793,25.984],[46.789,25.948],[46.793,25.984]] as [number,number][],
    points_of_interest: [
      { name: "Bicaz-szoros", lat: 46.798, lon: 25.982, description: "300 m-es sziklafalak" },
      { name: "Gyilkos-tó", lat: 46.791, lon: 25.952, description: "Természetes duzzasztótó" },
    ],
    tags: ["szoros","tó","körút","közepes","hasmaș"], image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    name: "Penteleu-csúcs – Vrancei-hegység",
    location: "Buzău megye – Vrancei-hegység",
    description: "A Vrancei-hegység legmagasabb csúcsa (1772 m). Ritkán látogatott, vadregényes terület a Keleti-Kárpátok déli részén, medve- és farkas-habitattal.",
    distance: 15.0, elevation: 1772, difficulty: "Nehéz", duration: "7 óra",
    start_lat: 45.671, start_lon: 26.48, end_lat: 45.671, end_lon: 26.48,
    coordinates: [[45.671,26.48],[45.677,26.487],[45.671,26.48]] as [number,number][],
    points_of_interest: [
      { name: "Penteleu-csúcs", lat: 45.676, lon: 25.486, description: "1772 m" },
    ],
    tags: ["csúcs","vadregényes","medve","nehéz","vrancea"], image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    name: "Siriu – Munte Siriu",
    location: "Buzău megye – Buzău-hegység",
    description: "A Buzău-hegység domináns csúcsa (1663 m), a Siriu-víztározó felett. Az erdős lejtőkön és karsztterepen vezető út a Dél-Kárpátok keleti kapujában kalandos túrát ígér.",
    distance: 11.5, elevation: 1663, difficulty: "Közepes", duration: "5 óra",
    start_lat: 45.539, start_lon: 26.308, end_lat: 45.539, end_lon: 26.308,
    coordinates: [[45.539,26.308],[45.545,26.315],[45.539,26.308]] as [number,number][],
    points_of_interest: [
      { name: "Siriu-csúcs", lat: 45.544, lon: 26.314, description: "1663 m, Buzău-hegység" },
      { name: "Siriu víztározó", lat: 45.541, lon: 26.31, description: "Festői víztározó" },
    ],
    tags: ["csúcs","víztározó","erdő","közepes","buzău"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    name: "Leaota-hegység – Vârful Leaota",
    location: "Dâmbovița megye – Leaota",
    description: "A Leaota-hegység (1898 m) ritkán látogatott természetvédelmi terület a Fogarasi-havasok és a Bucegi között. Páratlan magány, gyógynövényes rétek és vadon élő állatok jellemzik.",
    distance: 14.0, elevation: 1898, difficulty: "Nehéz", duration: "7 óra",
    start_lat: 45.358, start_lon: 25.302, end_lat: 45.358, end_lon: 25.302,
    coordinates: [[45.358,25.302],[45.365,25.309],[45.358,25.302]] as [number,number][],
    points_of_interest: [
      { name: "Leaota-csúcs", lat: 45.364, lon: 25.308, description: "1898 m, eldugott csúcs" },
    ],
    tags: ["csúcs","magány","gyógynövény","nehéz","dâmbovița"], image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    name: "Munții Lotrului – Ștefan-csúcs",
    location: "Vâlcea/Sibiu megye – Lotru",
    description: "A Lotru-hegység egyik legszebb útvonala a Ștefan-csúcsig (2242 m). Kiterjedt havasi legelők, hóvirágos rétek és a Lotru-völgy kristálytiszta folyója teszik emlékessé.",
    distance: 17.0, elevation: 2242, difficulty: "Nehéz", duration: "8 óra",
    start_lat: 45.44, start_lon: 23.78, end_lat: 45.44, end_lon: 23.78,
    coordinates: [[45.44,23.78],[45.447,23.787],[45.44,23.78]] as [number,number][],
    points_of_interest: [
      { name: "Ștefan-csúcs", lat: 45.446, lon: 23.786, description: "2242 m" },
    ],
    tags: ["csúcs","havasi legelő","folyó","nehéz","lotru"], image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
];

export async function seedTrails() {
  console.log(`Seeding ${trails.length} trails...`);
  for (const trail of trails) {
    await db.insert(trailsTable).values(trail).onConflictDoNothing();
  }
  console.log(`Done seeding ${trails.length} trails.`);
}

if (process.argv[1]?.endsWith("seed-trails.ts") || process.argv[1]?.endsWith("seed-trails.js")) {
  seedTrails().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
}
