import { join } from "https://deno.land/std@0.84.0/path/mod.ts";
import { BufReader } from "https://deno.land/std@0.84.0/io/bufio.ts";
import { parse } from "https://deno.land/std@0.84.0/encoding/csv.ts";

import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

// async function getFileList() {
//   for await (const dirEntry of Deno.readDir("C:\\DenoCourse")) {
//     console.log(dirEntry.name);
//    }
// }

// await getFileList();
interface Planet {
  [Key: string]: string;
}
async function loadPlanetsData() {
  const path = join(".", "kepler_exoplanets_nasa.csv");
  const file = await Deno.open(path);

  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    comment: "#",
    skipFirstRow: true,
  });
  Deno.close(file.rid);
  const planets = (result as Array<Planet>).filter((planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const planetaryMass = Number(planet["koi_smass"]);
    const planetarySollarRadius = Number(planet["koi_srad"]);

    return planet["koi_disposition"] === "CONFIRMED" &&
      planetaryRadius > 0.5 && planetaryRadius < 1.5 &&
      planetaryMass > 0.78 && planetaryMass < 1.04 &&
      planetarySollarRadius > 0.99 && planetarySollarRadius < 1.01;
  });
  return planets.map((planet) => {
    return _.pick(planet,
      "kepler_name",
      "koi_disposition",
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "koi_count",
      "koi_steff",
    );
  });
}

const newEarth = await loadPlanetsData();
for (const planet of newEarth) {
  console.log(planet);
}
console.log(`${newEarth.length} habitable planets found!`);
