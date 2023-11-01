import React from "react";

import "./styles.css";
import BlobSphere from "./components/BlobSphere/BlobSphere";
import { folder, useControls } from "leva";

import white from "./assets/images/05_gradient-alert.png";
import purpleRain from "./assets/images/02_gradient-primary-variation.png";
import rainbow from "./assets/images/03_gradient-secondary.png";
import passion from "./assets/images/04_gradient-error.png";
import cosmicFusion from "./assets/images/06_cosmic-fusion.png";
import deepOcean from "./assets/images/07_deep-ocean.png";
import luckyDay from "./assets/images/08_lucky-day.png";
import sunsetVibes from "./assets/images/09_sunset-vibes.png";
import cd from "./assets/images/10_cd.png";
import foil from "./assets/images/11_foil.png";
import halloween from "./assets/images/12_halloween.png";
import hollogram from "./assets/images/13_hollogram.png";
import imaginarium from "./assets/images/14_imaginarium.png";
import iridescent from "./assets/images/15_iridescent.png";
import pinkFloyd from "./assets/images/16_pink-floyd.png";
import sirens from "./assets/images/17_sirens.png";
import synthwave from "./assets/images/18_synthwave.png";
import klick01 from "./assets/images/klick-gradient-01.png";
import klick02 from "./assets/images/klick-gradient-02.png";
import klick03 from "./assets/images/klick-gradient-03.png";
import klick04 from "./assets/images/klick-gradient-04.png";
import klick05 from "./assets/images/klick-gradient-05.png";
import klick06 from "./assets/images/klick-gradient-06.png";

const gradientOrder = [
  "white",
  "purple-rain",
  "rainbow",
  "passion",
  "cosmic-fusion",
  "deep-ocean",
  "lucky-day",
  "sunset-vibes",
  "cd",
  "foil",
  "halloween",
  "hollogram",
  "imaginarium",
  "iridescent",
  "pink-floyd",
  "sirens",
  "synthwave",
  "Klick 01",
  "Klick 02",
  "Klick 03",
  "Klick 04",
  "Klick 05",
  "Klick 06"
];

const gradientLabels = {
  white: white,
  "purple-rain": purpleRain,
  rainbow: rainbow,
  passion: passion,
  "cosmic-fusion": cosmicFusion,
  "deep-ocean": deepOcean,
  "lucky-day": luckyDay,
  "sunset-vibes": sunsetVibes,
  cd: cd,
  foil: foil,
  halloween: halloween,
  hollogram: hollogram,
  imaginarium: imaginarium,
  iridescent: iridescent,
  "pink-floyd": pinkFloyd,
  sirens: sirens,
  synthwave: synthwave,
  "Klick 01": klick01,
  "Klick 02": klick02,
  "Klick 03": klick03,
  "Klick 04": klick04,
  "Klick 05": klick05,
  "Klick 06": klick06
};

export default function App() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  });
  const [selectedGradient, setSelectedGradient] = React.useState(
    params.gradient ?? 0
  );
  const { rotX, rotY, rotZ, ...settings } = useControls({
    "Blob Material": folder({
      roughness: {
        label: "Roughness",
        value: params.roughness ?? 1,
        min: 0.0,
        max: 1.0
      },
      metalness: {
        label: "Metalness",
        value: params.metalness ?? 0,
        min: 0.0,
        max: 1.0
      },
      envMapIntensity: {
        label: "EnvMap",
        value: params.envMapIntensity ?? 1,
        min: 0.0,
        max: 2.0
      },
      clearcoat: {
        label: "Clearcoat",
        value: params.clearcoat ?? 0,
        min: 0.0,
        max: 1.0
      },
      clearcoatRoughness: {
        label: "Clearcoat roughness",
        value: params.clearcoatRoughness ?? 0,
        min: 0.0,
        max: 1.0
      },
      transmission: {
        label: "Transmission",
        value: params.transmission ?? 0,
        min: 0.0,
        max: 1.0
      },
      color: {
        label: "Color",
        value: params.color ?? "#ffffff"
      },
      gradient: {
        label: "Gradient Map",
        options: gradientOrder.reduce(
          (acc, curr, index) => ({ ...acc, [curr]: index }),
          {}
        ),
        value: Number(selectedGradient),
        onChange: (value) => {
          setSelectedGradient(value);
        }
      }
    }),
    "Blob Noise": folder({
      distort: {
        label: "Distort",
        value: params.distort ?? 0.5,
        min: 0.0,
        max: 1.0
      },
      speed: {
        label: "Speed",
        value: params.speed ?? 1,
        min: 0,
        max: 10,
        step: 1
      },
      frequency: {
        label: "Frequency",
        value: params.frequency ?? 1.5,
        min: 0.01,
        max: 5
      },
      gooPoleAmount: {
        label: "Pole amount",
        value: params.gooPoleAmount ?? 1,
        min: 0,
        max: 1
      }
    }),
    "Blob Surface Noise": folder({
      surfaceDistort: {
        label: "Distort",
        value: params.surfaceDistort ?? 1,
        min: 0.0,
        max: 10.0
      },
      surfaceFrequency: {
        label: "Frequency",
        value: params.surfaceFrequency ?? 1,
        min: 0.01,
        max: 5
      },
      numberOfWaves: {
        label: "Number of waves",
        value: params.numberOfWaves ?? 4,
        min: 0,
        max: 20
      },
      surfaceSpeed: {
        label: "Speed",
        value: params.surfaceSpeed ?? 1,
        min: 0,
        max: 6,
        step: 1
      },
      surfacePoleAmount: {
        label: "Pole amount",
        value: params.surfacePoleAmount ?? 1,
        min: 0.0,
        max: 1.0
      }
    }),
    "Blob Geometry": folder({
      rotX: {
        label: "Rotate X",
        value: params.rotX ?? 0,
        min: 0.0,
        max: Math.PI * 2
      },
      rotY: {
        label: "Rotate Y",
        value: params.rotY ?? 0,
        min: 0.0,
        max: Math.PI * 2
      },
      rotZ: {
        label: "Rotate Z",
        value: params.rotZ ?? 0,
        min: 0.0,
        max: Math.PI * 2
      }
    })
  });

  async function copyContent(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Content copied to clipboard");
      /* Resolved - text copied to clipboard successfully */
    } catch (err) {
      console.error("Failed to copy: ", err);
      /* Rejected - text failed to copy to the clipboard */
    }
  }

  console.log("test", selectedGradient);
  return (
    <div className="App">
      <button
        onClick={() => {
          const url = new URL(window.location);
          url.search = new URLSearchParams({
            ...settings,
            gradient: selectedGradient
          });
          copyContent(url.href);
        }}
      >
        Copy Blob
      </button>
      <BlobSphere
        settings={settings}
        gradientOrder={gradientOrder}
        gradientLabels={gradientLabels}
        selectedGradient={selectedGradient}
      />
    </div>
  );
}
