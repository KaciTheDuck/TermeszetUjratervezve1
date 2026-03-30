import { db } from "./index";
import { trailsTable } from "./schema/trails";

const trails = [
  {
    name: "Nagykőhavas",
    location: "Brassó megye, Románia",
    description:
      "A Nagykőhavas (Piatra Mare) egy gyönyörű csúcs Brassó közelében, lenyűgöző erdélyi panorámával. A csúcsra vezető út sűrű erdőkön át, sziklás terepeken vezet, ahonnan pazar kilátás nyílik a Déli-Kárpátokra.",
    distance: 12.5,
    elevation: 1849,
    difficulty: "Nehéz",
    duration: "6 óra",
    start_lat: 45.58,
    start_lon: 25.6,
    end_lat: 45.52,
    end_lon: 25.65,
    coordinates: [
      [45.58, 25.6],
      [45.565, 25.625],
      [45.535, 25.655],
      [45.52, 25.65],
    ] as [number, number][],
    points_of_interest: [
      { name: "Kiindulópont", lat: 45.58, lon: 25.6, description: "Parkoló és információs tábla" },
      { name: "Nagykőhavas csúcs", lat: 45.52, lon: 25.65, description: "1849 m, pazar panoráma" },
    ],
    tags: ["csúcs", "erdő", "panoráma", "erdély", "sziklás"],
    image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    name: "Scropoasa tó",
    location: "Dâmbovița megye, Románia",
    description:
      "Festői hegyi tó a Dâmbovița forrásvidékén, csodálatos kilátással a Bucegi-hegységre. A túra kellemes erdei ösvényeken vezet, majd a gyönyörű tóhoz érkezünk.",
    distance: 8.2,
    elevation: 1200,
    difficulty: "Közepes",
    duration: "4 óra",
    start_lat: 45.33,
    start_lon: 25.35,
    end_lat: 45.34,
    end_lon: 25.38,
    coordinates: [
      [45.33, 25.35],
      [45.335, 25.365],
      [45.34, 25.38],
    ] as [number, number][],
    points_of_interest: [
      { name: "Scropoasa tó", lat: 45.34, lon: 25.38, description: "Gyönyörű hegyi tó" },
    ],
    tags: ["tó", "erdő", "bucegi", "víz", "könnyű"],
    image_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
  {
    name: "Csukás-tető",
    location: "Kovászna megye, Románia",
    description:
      "A Csukás (Ciucaș) egy vulkanikus kőzetből álló, látványos csúcs Háromszéken. Különleges sziklaformáival és változatos növényzetével az egyik legszebb erdélyi túrázó célpont.",
    distance: 15.0,
    elevation: 1961,
    difficulty: "Nehéz",
    duration: "7 óra",
    start_lat: 45.515,
    start_lon: 26.065,
    end_lat: 45.5,
    end_lon: 26.075,
    coordinates: [
      [45.515, 26.065],
      [45.505, 26.072],
      [45.5, 26.075],
    ] as [number, number][],
    points_of_interest: [
      { name: "Ciucaș csúcs", lat: 45.5, lon: 26.075, description: "1961 m, vulkáni sziklák" },
      { name: "Tigăile Mari", lat: 45.504, lon: 26.07, description: "Látványos sziklaoszlopok" },
    ],
    tags: ["csúcs", "sziklák", "háromszék", "nehéz", "erdély"],
    image_url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  },
  {
    name: "Királykő",
    location: "Brassó megye, Románia",
    description:
      "A Királykő (Piatra Craiului) a Déli-Kárpátok egyik legismertebb vonulata, hosszú mészkőgerincével Románia egyik legszebb hegysége. A gerincen végig lenyűgöző kilátás nyílik.",
    distance: 18.3,
    elevation: 2239,
    difficulty: "Nagyon nehéz",
    duration: "9 óra",
    start_lat: 45.51,
    start_lon: 25.23,
    end_lat: 45.485,
    end_lon: 25.225,
    coordinates: [
      [45.51, 25.23],
      [45.498, 25.226],
      [45.485, 25.225],
    ] as [number, number][],
    points_of_interest: [
      { name: "La Om csúcs", lat: 45.49, lon: 25.225, description: "2239 m, a Királykő legmagasabb pontja" },
      { name: "Curmătura menedékház", lat: 45.505, lon: 25.228, description: "Menedékház és kilátópont" },
    ],
    tags: ["gerinc", "mészkő", "magashegység", "nehéz", "brassó"],
    image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
  {
    name: "Büdös-barlang és Torjai-szoros",
    location: "Kovászna megye, Románia",
    description:
      "Egyedülálló természeti élmény: a kénkibocsátásáról híres Büdös-barlang és a festői Torjai-szoros meglátogatása egyetlen körúton.",
    distance: 6.5,
    elevation: 420,
    difficulty: "Könnyű",
    duration: "3 óra",
    start_lat: 46.04,
    start_lon: 25.9,
    end_lat: 46.04,
    end_lon: 25.9,
    coordinates: [
      [46.04, 25.9],
      [46.045, 25.91],
      [46.04, 25.9],
    ] as [number, number][],
    points_of_interest: [
      { name: "Büdös-barlang", lat: 46.045, lon: 25.91, description: "Természetes kén-dioxid kibocsátás" },
      { name: "Torjai-szoros", lat: 46.042, lon: 25.905, description: "Festői sziklaszoros" },
    ],
    tags: ["barlang", "geológia", "könnyű", "körút", "székelyföld"],
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  },
  {
    name: "Hargita-csúcs",
    location: "Hargita megye, Románia",
    description:
      "A Hargita-fennsík legmagasabb pontja, amelyet vulkáni kráterek és fenyvesek tesznek egyedülállóvá. A tető körzetében mocsaras területek, sások és ritka növények élnek.",
    distance: 9.4,
    elevation: 1800,
    difficulty: "Közepes",
    duration: "4-5 óra",
    start_lat: 46.39,
    start_lon: 25.62,
    end_lat: 46.39,
    end_lon: 25.62,
    coordinates: [
      [46.39, 25.62],
      [46.397, 25.635],
      [46.39, 25.62],
    ] as [number, number][],
    points_of_interest: [
      { name: "Hargita-csúcs", lat: 46.397, lon: 25.635, description: "1800 m, vulkáni fennsík" },
    ],
    tags: ["vulkán", "fennsík", "körút", "fenyves", "székelyföld"],
    image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    name: "Sinaia-Bucegi kör",
    location: "Prahova megye, Románia",
    description:
      "A Bucegi-fennsík egy nagy körúton, Sinajáról kiindulva. Útközben megtekinthető a Szfinx és Babele nevű természetes sziklaformáció, majd a Caraiman-csúcs keresztje.",
    distance: 22.0,
    elevation: 2505,
    difficulty: "Nagyon nehéz",
    duration: "10 óra",
    start_lat: 45.35,
    start_lon: 25.55,
    end_lat: 45.35,
    end_lon: 25.55,
    coordinates: [
      [45.35, 25.55],
      [45.4, 25.525],
      [45.42, 25.52],
      [45.35, 25.55],
    ] as [number, number][],
    points_of_interest: [
      { name: "Szfinx (Sfinxul)", lat: 45.4, lon: 25.525, description: "Különleges természetes sziklaformáció" },
      { name: "Babele", lat: 45.405, lon: 25.52, description: "Gombaalakú sziklaformációk" },
      { name: "Caraiman-csúcs", lat: 45.41, lon: 25.518, description: "2384 m, hatalmas vaskereszt" },
    ],
    tags: ["fennsík", "szikla", "körút", "bucegi", "sinaia", "magashegység"],
    image_url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
  },
  {
    name: "Szebeni-havasok, Nedeia",
    location: "Szeben megye, Románia",
    description:
      "A Szebeni-havasok (Munții Cindrel) egyik legszebb túrája, amely a Nedeia-csúcsra vezet. Útközben havasi legelők, kristálytiszta patakok és vadvirágos rétek várnak.",
    distance: 14.8,
    elevation: 2244,
    difficulty: "Nehéz",
    duration: "7-8 óra",
    start_lat: 45.62,
    start_lon: 23.85,
    end_lat: 45.64,
    end_lon: 23.895,
    coordinates: [
      [45.62, 23.85],
      [45.63, 23.87],
      [45.64, 23.895],
    ] as [number, number][],
    points_of_interest: [
      { name: "Cindrel csúcs", lat: 45.64, lon: 23.895, description: "2244 m, panoráma a Kárpátokra" },
    ],
    tags: ["havasi", "legelő", "patak", "szeben", "kárpátok"],
    image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
];

async function seed() {
  console.log("Seeding trails...");
  for (const trail of trails) {
    await db
      .insert(trailsTable)
      .values(trail)
      .onConflictDoNothing();
  }
  console.log(`Done. Seeded ${trails.length} trails.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
