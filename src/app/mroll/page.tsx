"use client";
import { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import CustomUpload from "../../components/CustomUpload";
import { PREGNERATED_TABLES } from "../../constants/prefilled";

type DiceConfig = {
  tableSize: number;
  rollCount: number;
};

export default function Mroll() {
  // Mode selection:
  // "no-pregen" = manual; valid pregenerated key = use that table;
  // "custom-json" = upload your own JSON table.
  const [pregenerated, setPregenerated] = useState("no-pregen");

  // For manual mode.
  const [configs, setConfigs] = useState<DiceConfig[]>([]);
  // For custom JSON mode.
  const [jsonTable, setJsonTable] = useState<Record<number, string> | null>(null);
  const [jsonRollCount, setJsonRollCount] = useState<number>(1);

  // Results stored as an array of strings.
  const [results, setResults] = useState<string[]>([]);
  const [duplicatesAllowed, setDuplicatesAllowed] = useState<boolean>(true);
  const [image, setImage] = useState<string | null>(null);
  const [pregenResult, setPregenResult] = useState<string | null>(null);

  // On mount (or mode change), set default manual configuration.
  useEffect(() => {
    if (pregenerated === "no-pregen") {
      setConfigs([{ tableSize: 100, rollCount: 1 }]);
    }
  }, [pregenerated]);

  // Manual mode handlers.
  const handleConfigChange = (index: number, field: keyof DiceConfig, value: number) => {
    const newConfigs = [...configs];
    newConfigs[index][field] = value;
    setConfigs(newConfigs);
  };

  const addConfig = () => {
    setConfigs([...configs, { tableSize: 6, rollCount: 1 }]);
  };

  const removeConfig = (index: number) => {
    setConfigs(configs.filter((_, i) => i !== index));
  };

  // Roll function for manual mode.
  const rollManual = () => {
    const output: string[] = [];
    configs.forEach((config, idx) => {
      const pool = config.tableSize;
      const rolls: number[] = [];
      if (!duplicatesAllowed) {
        if (config.rollCount > pool) {
          alert("Dice roll count exceeds table size. Please allow duplicates or adjust values.");
          for (let i = 0; i < config.rollCount; i++) {
            rolls.push(Math.floor(Math.random() * pool) + 1);
          }
        } else {
          while (rolls.length < config.rollCount) {
            const roll = Math.floor(Math.random() * pool) + 1;
            if (!rolls.includes(roll)) {
              rolls.push(roll);
            }
          }
        }
      } else {
        for (let i = 0; i < config.rollCount; i++) {
          rolls.push(Math.floor(Math.random() * pool) + 1);
        }
      }
      // Join each roll with newline characters.
      output.push(`Table ${idx + 1} (d${pool}):\n${rolls.join("\n")}`);
    });
    setResults(output);
  };

  // Roll function for pregenerated tables.
  const rollPregenerated = () => {
    const tableData = PREGNERATED_TABLES[pregenerated];
    if (tableData) {
      const roll = Math.floor(Math.random() * tableData.poolSize) + 1;
      setPregenResult(tableData.table[roll]);
    }
  };

  // Roll function for custom JSON mode.
  const rollCustomJson = () => {
    if (jsonTable) {
      const poolSize = Object.keys(jsonTable).length;
      const output: string[] = [];
      for (let i = 0; i < jsonRollCount; i++) {
        const roll = Math.floor(Math.random() * poolSize) + 1;
        output.push(jsonTable[roll]);
      }
      setResults(output);
    }
  };

  // JSON file upload handler.
  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setJsonTable(parsed);
        } catch {
          alert("Invalid JSON file.");
        }
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  // Image upload handler.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto min-h-screen bg-black text-white p-8 space-y-8">
      <h1 className="text-4xl font-bold text-center">Dice Roller</h1>

      {/* Image Upload Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Upload an Image</h2>
        <p className="text-gray-400">Select an image to display alongside your results.</p>
        <CustomUpload accept="image/*" onChange={handleImageUpload} className="w-full max-w-md" />
      </section>

      {/* Table Source Selection */}
      <section className="space-y-4 border-t border-gray-700 pt-6">
        <h2 className="text-2xl font-semibold">Table Source</h2>
        <label className="block">
          <span className="block mb-1">Select a Table:</span>
          <select
            value={pregenerated}
            onChange={(e) => {
              setPregenerated(e.target.value);
              setPregenResult(null);
              setResults([]);
            }}
            className="mt-1 p-2 bg-gray-800 text-white border border-gray-600 rounded"
          >
            <option value="no-pregen">Use your own table (manual entry)</option>
            <option value="inspiring-d4">Inspiring NPC Encounter (d4)</option>
            <option value="goblin-d6">Goblin Encounter (d6)</option>
            <option value="epic-d8">Epic Encounter (d8)</option>
            <option value="mythic-d10">Mythic Encounter (d10)</option>
            <option value="grand-d20">Grand Encounter (d20)</option>
            <option value="colossal-d100">Colossal Encounter (d100)</option>
            <option value="custom-json">Use your own JSON Table</option>
          </select>
        </label>
      </section>

      {/* Pregenerated Content Section */}
      {pregenerated !== "no-pregen" && pregenerated !== "custom-json" && (
        <section className="space-y-4 border-t border-gray-700 pt-6">
          <h2 className="text-2xl font-semibold">Pregenerated Content</h2>
          <p className="text-gray-400">
            Pool Size: {PREGNERATED_TABLES[pregenerated]?.poolSize ?? "-"}
          </p>
          <CustomButton
            onClick={rollPregenerated}
            className="w-full bg-gray-800 hover:bg-gray-700 px-6 py-3"
          >
            Roll Pregenerated Content
          </CustomButton>
          {pregenResult && (
            <div className="mt-4 p-4 border border-gray-700 rounded">
              <h3 className="text-xl font-semibold">Result</h3>
              <p>{pregenResult}</p>
            </div>
          )}
        </section>
      )}

      {/* Custom JSON Table Section */}
      {pregenerated === "custom-json" && (
        <section className="space-y-4 border-t border-gray-700 pt-6">
          <h2 className="text-2xl font-semibold">Custom JSON Table</h2>
          {!jsonTable ? (
            <>
              <p className="text-gray-400">
                Upload a JSON file to use as your table. The JSON should be an object with numeric keys.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleJsonUpload}
                className="mt-1 p-2 bg-gray-800 text-white border border-gray-600 rounded w-full max-w-md"
              />
            </>
          ) : (
            <>
              <p className="text-gray-400">
                JSON Table loaded. Pool Size: {Object.keys(jsonTable).length}
              </p>
              <label className="block">
                <span className="block mb-1">Number of Rolls:</span>
                <CustomInput
                  type="number"
                  value={jsonRollCount}
                  onChange={(e) => setJsonRollCount(parseInt(e.target.value))}
                  className="mt-1 w-24"
                />
              </label>
              <CustomButton
                onClick={rollCustomJson}
                className="w-full bg-gray-800 hover:bg-gray-700 px-6 py-3"
              >
                Roll JSON Table
              </CustomButton>
            </>
          )}
        </section>
      )}

      {/* Manual Configuration Section */}
      {pregenerated === "no-pregen" && (
        <section className="space-y-6 border-t border-gray-700 pt-6">
          <h2 className="text-2xl font-semibold">Manual Dice Configuration</h2>
          {configs.map((config, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-700 rounded"
            >
              <div className="flex-1">
                <label className="block">
                  <span className="block mb-1 text-sm">Table Size (e.g., 100 for d100):</span>
                  <CustomInput
                    type="number"
                    value={config.tableSize}
                    onChange={(e) =>
                      handleConfigChange(index, "tableSize", parseInt(e.target.value))
                    }
                    className="w-20"
                  />
                </label>
              </div>
              <div className="flex-1">
                <label className="block">
                  <span className="block mb-1 text-sm">Number of Rolls:</span>
                  <CustomInput
                    type="number"
                    value={config.rollCount}
                    onChange={(e) =>
                      handleConfigChange(index, "rollCount", parseInt(e.target.value))
                    }
                    className="w-20"
                  />
                </label>
              </div>
              <div className="sm:flex-shrink-0 text-right">
                <CustomButton
                  onClick={() => removeConfig(index)}
                  className="bg-gray-800 hover:bg-gray-700"
                >
                  Remove
                </CustomButton>
              </div>
            </div>
          ))}
          <div>
            <CustomButton onClick={addConfig} className="bg-gray-800 hover:bg-gray-700 w-full">
              Add Dice Table
            </CustomButton>
          </div>
        </section>
      )}

      {/* Allow Duplicates & Roll Button for Manual Mode */}
      {pregenerated === "no-pregen" && (
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={duplicatesAllowed}
              onChange={() => setDuplicatesAllowed(!duplicatesAllowed)}
              className="w-4 h-4"
            />
            <label>Allow duplicates</label>
          </div>
          <CustomButton
            onClick={rollManual}
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 px-6 py-3"
          >
            Roll Dice
          </CustomButton>
        </section>
      )}

      {/* Results Section (for manual mode and custom JSON) */}
      {results.length > 0 && (pregenerated === "no-pregen" || pregenerated === "custom-json") && (
        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-semibold">Results</h2>
          {results.map((res, idx) => (
            <div key={idx} className="p-4 border border-gray-700 rounded">
              <pre className="whitespace-pre-wrap">{res}</pre>
            </div>
          ))}
          {image && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Your Uploaded Image:</h3>
              <img src={image} alt="Uploaded" className="max-w-full h-auto" />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
