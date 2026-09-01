import { Sun, Cpu, Satellite, Magnet } from "lucide-react";
import { motion } from "framer-motion";
import StatusIndicator from "../common/StatusIndicator";
import { CONNECTION_TONES } from "../../constants";
import { useSystemData } from "../../hooks/useSystemData";
import { formatNumber, formatPercent } from "../../utils/format";

export default function SystemOverviewStrip() {
  const { solarTelemetry, spacePrediction, groundValidation, systemStatus } = useSystemData();

  const noaaTone = CONNECTION_TONES[systemStatus.noaaConnectionStatus] || "muted";
  const stationTone = CONNECTION_TONES[groundValidation.groundStationStatus] || "muted";
  const predictionTone =
    spacePrediction.predictionStatus === "CRITICAL"
      ? "red"
      : spacePrediction.predictionStatus === "WARNING"
        ? "amber"
        : "violet";

  const tiles = [
    {
      key: "solar",
      icon: Sun,
      tone: "amber",
      status: solarTelemetry.fluxClass,
      value: formatNumber(solarTelemetry.xrayFlux, 2),
      unit: "µW/m²",
      sub: "Solar X-ray activity",
    },
    {
      key: "ml",
      icon: Cpu,
      tone: predictionTone,
      status: spacePrediction.predictionStatus,
      value: formatPercent(spacePrediction.predictionProbability),
      sub: "ML prediction probability",
      pulse: predictionTone !== "violet",
    },
    {
      key: "noaa",
      icon: Satellite,
      tone: noaaTone,
      status: systemStatus.noaaConnectionStatus,
      value: systemStatus.noaaConnectionStatus,
      sub: "NOAA GOES data",
      pulse: noaaTone === "amber",
    },
    {
      key: "hardware",
      icon: Magnet,
      tone: stationTone,
      status: groundValidation.groundStationStatus,
      value: formatNumber(groundValidation.magneticFieldMagnitude, 1),
      unit: "µT",
      sub: `Ground station · ${groundValidation.groundStationId}`,
      pulse: stationTone === "amber",
    },
  ];

  return (
    <div className="overview-strip">
      {tiles.map((tile, index) => {
        const Icon = tile.icon;
        return (
          <motion.div
            key={tile.key}
            className={`overview-tile tone-${tile.tone}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.35, ease: "easeOut" }}
          >
            <div className="overview-tile-head">
              <span className="overview-tile-icon" aria-hidden="true">
                <Icon size={14} strokeWidth={1.9} />
              </span>
              <StatusIndicator tone={tile.tone} label={tile.status} pulse={tile.pulse} />
            </div>
            <div className="overview-tile-value">
              {tile.value}
              {tile.unit ? <span className="overview-tile-unit">{tile.unit}</span> : null}
            </div>
            <div className="overview-tile-sub">{tile.sub}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
