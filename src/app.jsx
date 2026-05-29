import React, { useState } from 'react';

// Character base data (Ascension stats / signature traits)
const CHARACTERS = {
  custom: { name: 'Custom / Other', atk: 2000, critRate: 60, critDamage: 120, dmgBonus: 46.6, em: 0 },
  skirk: { name: 'Skirk', atk: 2200, critRate: 65, critDamage: 160, dmgBonus: 60.0, em: 0 },
  furina: { name: 'Furina', atk: 1500, critRate: 74.2, critDamage: 120, dmgBonus: 46.6, em: 80 },
  arlecchino: { name: 'Arlecchino', atk: 2400, critRate: 60, critDamage: 158.4, dmgBonus: 46.6, em: 100 },
  mavuika: { name: 'Mavuika', atk: 2300, critRate: 70, canvas: 140, dmgBonus: 50.0, em: 80 },
  raiden: { name: 'Raiden Shogun', atk: 1900, critRate: 60, critDamage: 120, dmgBonus: 75.0, em: 0 }, // Or 1000 if Hyperbloom LMAO!
  hutao: { name: 'Hu Tao', atk: 3500, critRate: 60, critDamage: 158.4, dmgBonus: 33.0, em: 220 },
};

export default function App() {
  const [selectedChar, setSelectedChar] = useState('custom');
  
  // Character and Combat Stats
  const [stats, setStats] = useState({
    atk: 2000,
    talentMultiplier: 250,
    critRate: 60,
    critDamage: 120,
    dmgBonus: 46.6,
    em: 0,
  });

  // Enemy Stats State
  const [enemy, setEnemy] = useState({
    charLevel: 90,
    enemyLevel: 90,
    resistance: 10, // Standard 10% base resistance
    defShred: 0,    // e.g. Raiden C2 or Ayaka burst
  });

  // Handle Character Dropdown Change
  const handleCharacterChange = (e) => {
    const charKey = e.target.value;
    setSelectedChar(charKey);
    
    // Auto-fill stats based on preset, keep talent multiplier custom
    setStats((prev) => ({
      ...prev,
      ...CHARACTERS[charKey],
      talentMultiplier: prev.talentMultiplier 
    }));
  };

  const handleStatChange = (e) => {
    const { name, value } = e.target;
    setStats((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    if (selectedChar !== 'custom') setSelectedChar('custom'); // Switch to custom if they tweak numbers
  };

  const handleEnemyChange = (e) => {
    const { name, value } = e.target;
    setEnemy((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Advanced Genshin Math Calculation
  const calculateDamage = () => {
    const { atk, talentMultiplier, critRate, critDamage, dmgBonus } = stats;
    const { charLevel, enemyLevel, resistance, defShred } = enemy;

    // 1. Outgoing Base Damage & Damage Bonuses
    const baseDmg = atk * (talentMultiplier / 100);
    const dmgBonusMultiplier = 1 + (dmgBonus / 100);
    
    // 2. Crit Multipliers
    const actualCritRate = Math.min(Math.max(critRate, 0), 100) / 100;
    const actualCritDamage = critDamage / 100;
    const critMultiplier = 1 + (actualCritRate * actualCritDamage);

    // 3. Enemy Defense Factor
    const cleanDefShred = Math.min(Math.max(defShred, 0), 100) / 100;
    const defMultiplier = (charLevel + 100) / ((charLevel + 100) + (enemyLevel + 100) * (1 - cleanDefShred));

    // 4. Enemy Resistance Factor
    const resPercent = resistance / 100;
    let resMultiplier = 1;
    if (resPercent >= 0.75) {
      resMultiplier = 1 / (1 + 4 * resPercent);
    } else if (resPercent >= 0) {
      resMultiplier = 1 - resPercent;
    } else {
      resMultiplier = 1 - (resPercent / 2); // Resistance shred below 0% is halved
    }

    // 5. Reaction DMG

    // first calculate EM bonus
    const em = stats.em;
    const ampEMBonus = (2.78 * em) / (em + 1400); // Amplifying Reaction Bonus
    const transfEMBonus = (16 * em) / (em + 2000); // Transformative Reaction Bonus

    // Vape Damage (Reverse)
    const vapeMultiplier = 1.5 * (1 + ampEMBonus); // Vaporize multiplier with EM bonus
    const finalVapeCritDmg = results.crit * vapeMultiplier; // Critical Vaporize damage

    // Hyperbloom Danage (reverse, character level 90 assumed for now)
    const level90Base = 1446.85; // Base Hyperbloom damage at level 90 without EM
    const hyperbloomMultiplier = 3.0; // Hyperbloom multiplier
    const finalHyperbloomDmg = level90Base * hyperbloomMultiplier * (1 + transfEMBonus) * resMultiplier; // Final Hyperbloom damage with EM bonus





    // Combined Math
    const baseOutgoing = baseDmg * dmgBonusMultiplier * defMultiplier * resMultiplier;

    return {
      normal: Math.round(baseOutgoing),
      crit: Math.round(baseOutgoing * (1 + actualCritDamage)),
      average: Math.round(baseOutgoing * critMultiplier),
    };
  };

  const results = calculateDamage();

  return (
    <div 
      className="min-h-screen bg-gray-900 bg-cover bg-center bg-no-repeat bg-fixed flex flex-col items-center py-10 px-4"
      style={{ 
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.85)), url('https://i.ibb.co/7x44hxdG/YAYYYYY.png')` 
      }}
    >
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-yellow-500 mb-2">✦ Genshin Impact DPS Calculator ✦</h1>
        <p className="text-gray-400 text-sm">Now featuring Enemy Defenses and Character Presets!</p>
      </header>

      <main className="w-full max-w-5xl grid md:grid-cols-3 gap-6 bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        
        {/* COLUMN 1: CHARACTER SELECTION & STATS */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 text-yellow-500">1. Character</h2>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-400">Select Profile</label>
            <select 
              value={selectedChar} 
              onChange={handleCharacterChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {Object.keys(CHARACTERS).map((key) => (
                <option key={key} value={key}>{CHARACTERS[key].name}</option>
              ))}
            </select>
          </div>

          {[
            { label: 'Total ATK / Scaled Stat', name: 'atk', unit: 'Pts' },
            { label: 'Talent Multiplier', name: 'talentMultiplier', unit: '%' },
            { label: 'CRIT Rate', name: 'critRate', unit: '%' },
            { label: 'CRIT DMG', name: 'critDamage', unit: '%' },
            { label: 'DMG Bonus', name: 'dmgBonus', unit: '%' },
            { label: 'Elemental Mastery', name: 'em', unit: 'EM' },
          ].map((input) => (
            <div key={input.name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-400">{input.label}</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name={input.name}
                  value={stats[input.name]}
                  onChange={handleStatChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">{input.unit}</div>
              </div>
            </div>
          ))}
        </section>

        {/* COLUMN 2: ENEMY TARGET STATS */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 text-red-400">2. Target Enemy</h2>
          
          {[
            { label: 'Your Character Level', name: 'charLevel', unit: 'Lv' },
            { label: 'Enemy Level', name: 'enemyLevel', unit: 'Lv' },
            { label: 'Enemy Elemental RES', name: 'resistance', unit: '%' },
            { label: 'Your DEF Shred / Ignore', name: 'defShred', unit: '%' },
          ].map((input) => (
            <div key={input.name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-400">{input.label}</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name={input.name}
                  value={enemy[input.name]}
                  onChange={handleEnemyChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">{input.unit}</div>
              </div>
            </div>
          ))}
          <div className="text-xs text-gray-500 bg-gray-900 p-3 rounded-lg border border-gray-700 mt-2">
            💡 *Most standard Hilichurls and bosses have 10% Elemental RES. Humanoid enemies like Nobushi often have -20% Physical RES but 10% Elemental RES.*
          </div>
        </section>

        {/* COLUMN 3: REAL DMG OUTPUT */}
        <section className="flex flex-col justify-between bg-gray-850 p-6 rounded-xl border border-gray-700 bg-opacity-50">
          <div>
            <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-6 text-green-400">3. True Output</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-400 font-medium">Non-Critical Hit</p>
                <p className="text-2xl font-bold text-gray-300">{results.normal.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 font-medium">Critical Hit</p>
                <p className="text-2xl font-bold text-red-400">{results.crit.toLocaleString()}</p>
              </div>

              <hr className="border-gray-700" />

              <div>
                <p className="text-sm text-yellow-500 font-semibold uppercase tracking-wider">Average DPS Value</p>
                <p className="text-4xl font-extrabold text-yellow-400 mt-1">{results.average.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                  This represents the exact damage you will see pop up on your screen in-game against a real level {enemy.enemyLevel} monster!
                  *Do remember though: This is just the Damage for one single hit of one character. In actual combat, your DPS will depend on how many hits you can land in a given time frame, your rotation, and the enemy's behavior.*
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Check out this Repo on GitHub: <a href="https://github.com/4G0NYY/genshin-dps-calc" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">https://github.com/4G0NYY/genshin-dps-calc</a>
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}