import { StickerDefinition } from '../types';

export const STICKERS: StickerDefinition[] = [
  // 1. กระทงใบตองคลาสสิก
  {
    id: 'krathong-classic',
    name: 'กระทงใบตองคลาสสิก',
    category: 'krathong',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="72" rx="42" ry="14" fill="#15803d"/>
      <ellipse cx="50" cy="68" rx="38" ry="11" fill="#16a34a"/>
      <path d="M20 66 Q26 48 34 64 Q42 46 50 63 Q58 46 66 64 Q74 48 80 66" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <path d="M30 62 Q38 42 45 60 Q50 38 55 60 Q62 42 70 62" fill="#ec4899"/>
      <path d="M38 58 Q45 40 50 56 Q55 40 62 58" fill="#f472b6"/>
      <rect x="48" y="24" width="4" height="24" fill="#fef08a"/>
      <path d="M50 12 Q56 20 50 25 Q44 20 50 12" fill="#f59e0b"/>
      <circle cx="50" cy="20" r="3" fill="#ffffff"/>
      <line x1="44" y1="20" x2="44" y2="46" stroke="#991b1b" stroke-width="1.5"/>
      <line x1="56" y1="20" x2="56" y2="46" stroke="#991b1b" stroke-width="1.5"/>
    </svg>`,
  },

  // 2. กระทงทองคำอร่าม
  {
    id: 'krathong-gold',
    name: 'กระทงทองคำอร่าม',
    category: 'krathong',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="74" rx="40" ry="13" fill="#b45309"/>
      <ellipse cx="50" cy="70" rx="36" ry="10" fill="#d97706"/>
      <path d="M18 68 Q28 44 36 66 Q44 42 50 65 Q56 42 64 66 Q72 44 82 68" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>
      <path d="M26 62 Q36 38 44 60 Q50 34 56 60 Q64 38 74 62" fill="#fef08a"/>
      <rect x="48" y="22" width="4" height="26" fill="#fef08a"/>
      <path d="M50 10 Q57 18 50 24 Q43 18 50 10" fill="#f97316"/>
      <circle cx="50" cy="18" r="4" fill="#fef08a"/>
      <line x1="43" y1="18" x2="43" y2="46" stroke="#b45309" stroke-width="1.5"/>
      <line x1="57" y1="18" x2="57" y2="46" stroke="#b45309" stroke-width="1.5"/>
    </svg>`,
  },

  // 3. กระทงดอกบัวสีชมพูหวาน
  {
    id: 'krathong-pink-lotus',
    name: 'กระทงดอกบัวชมพูหวาน',
    category: 'krathong',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="76" rx="42" ry="12" fill="#15803d"/>
      <path d="M15 72 Q25 45 38 68 Q50 35 62 68 Q75 45 85 72" fill="#f43f5e"/>
      <path d="M24 68 Q34 42 44 64 Q50 32 56 64 Q66 42 76 68" fill="#fb7185"/>
      <path d="M32 64 Q42 38 50 58 Q58 38 68 64" fill="#fbcfe8"/>
      <circle cx="50" cy="56" r="10" fill="#facc15"/>
      <rect x="48" y="26" width="4" height="22" fill="#ffffff"/>
      <path d="M50 14 Q56 22 50 27 Q44 22 50 14" fill="#fbbf24"/>
    </svg>`,
  },

  // 4. กระทงดอกไม้รวมมิตร
  {
    id: 'krathong-floral',
    name: 'กระทงดอกไม้สดใส',
    category: 'krathong',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="74" rx="42" ry="14" fill="#166534"/>
      <circle cx="28" cy="62" r="10" fill="#eab308"/>
      <circle cx="42" cy="60" r="10" fill="#ec4899"/>
      <circle cx="58" cy="60" r="10" fill="#38bdf8"/>
      <circle cx="72" cy="62" r="10" fill="#f97316"/>
      <circle cx="50" cy="66" r="9" fill="#a855f7"/>
      <rect x="48" y="24" width="4" height="26" fill="#fef08a"/>
      <path d="M50 10 Q56 18 50 24 Q44 18 50 10" fill="#f59e0b"/>
    </svg>`,
  },

  // 5. โคมลอยยี่เป็งเดี่ยว
  {
    id: 'lantern-single',
    name: 'โคมลอยยี่เป็งเรืองแสง',
    category: 'lantern',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#d97706"/>
        </radialGradient>
      </defs>
      <path d="M28 20 C24 50 30 75 42 82 L58 82 C70 75 76 50 72 20 Z" fill="url(#lanternGlow)"/>
      <ellipse cx="50" cy="20" rx="22" ry="6" fill="#fef08a"/>
      <ellipse cx="50" cy="82" rx="8" ry="3" fill="#78350f"/>
      <ellipse cx="50" cy="80" rx="4" ry="2" fill="#ffffff"/>
      <path d="M48 83 L46 92 M52 83 L54 92" stroke="#b45309" stroke-width="1.5"/>
    </svg>`,
  },

  // 6. ฝูงโคมลอยประดับฟ้า
  {
    id: 'lantern-cluster',
    name: 'ฝูงโคมลอยเต็มฟากฟ้า',
    category: 'lantern',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Big lantern -->
      <path d="M40 15 C37 38 41 55 48 60 L58 60 C65 55 69 38 66 15 Z" fill="#fbbf24"/>
      <ellipse cx="53" cy="15" rx="13" ry="4" fill="#fef08a"/>
      <!-- Small left lantern -->
      <path d="M16 40 C14 55 17 65 22 68 L28 68 C33 65 36 55 34 40 Z" fill="#f59e0b"/>
      <!-- Small right lantern -->
      <path d="M72 32 C70 48 73 58 78 62 L84 62 C89 58 92 48 90 32 Z" fill="#fbbf24"/>
      <circle cx="53" cy="58" r="3" fill="#ffffff"/>
      <circle cx="25" cy="67" r="2" fill="#ffffff"/>
      <circle cx="81" cy="60" r="2" fill="#ffffff"/>
    </svg>`,
  },

  // 7. พระปฐมเจดีย์สีทอง (Wat Phra Pathom Chedi)
  {
    id: 'phra-pathom-chedi-icon',
    name: 'พระปฐมเจดีย์สีทอง',
    category: 'thai',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Spire -->
      <path d="M50 4 L53 25 L47 25 Z" fill="#facc15"/>
      <circle cx="50" cy="5" r="3" fill="#ffffff"/>
      <!-- Rings -->
      <rect x="44" y="25" width="12" height="4" fill="#eab308" rx="1"/>
      <rect x="42" y="29" width="16" height="4" fill="#ca8a04" rx="1"/>
      <!-- Bell Body -->
      <path d="M40 33 C26 50 24 68 22 74 L78 74 C76 68 74 50 60 33 Z" fill="#facc15"/>
      <path d="M45 35 C38 48 36 62 34 74 L66 74 C64 62 62 48 55 35 Z" fill="#fef08a"/>
      <!-- Base tiers -->
      <rect x="18" y="74" width="64" height="6" fill="#eab308" rx="2"/>
      <rect x="14" y="80" width="72" height="7" fill="#ca8a04" rx="2"/>
      <rect x="10" y="87" width="80" height="8" fill="#a16207" rx="3"/>
    </svg>`,
  },

  // 8. พระจันทร์เต็มดวงเรืองแสง
  {
    id: 'full-moon',
    name: 'พระจันทร์เต็มดวงวันเพ็ญ',
    category: 'light',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="moonGrad" cx="45%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="60%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="url(#moonGrad)"/>
      <circle cx="38" cy="36" r="6" fill="#fef9c3" opacity="0.6"/>
      <circle cx="62" cy="42" r="9" fill="#fef9c3" opacity="0.6"/>
      <circle cx="48" cy="62" r="8" fill="#fef9c3" opacity="0.5"/>
    </svg>`,
  },

  // 9. กระต่ายบนดวงจันทร์
  {
    id: 'moon-rabbit',
    name: 'กระต่ายบนดวงจันทร์',
    category: 'thai',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Moon background -->
      <circle cx="50" cy="50" r="42" fill="#fef08a"/>
      <!-- Rabbit Body -->
      <ellipse cx="50" cy="62" rx="18" ry="14" fill="#ffffff"/>
      <circle cx="60" cy="48" r="11" fill="#ffffff"/>
      <!-- Ears -->
      <path d="M58 40 C56 22 62 18 64 25 C66 32 64 38 62 40" fill="#ffffff"/>
      <path d="M59 36 C58 24 61 22 62 26" fill="#fbcfe8"/>
      <path d="M64 40 C66 24 72 20 73 27 C74 34 70 39 67 41" fill="#ffffff"/>
      <path d="M65 36 C66 26 70 24 70 28" fill="#fbcfe8"/>
      <!-- Eye & Cheeks -->
      <circle cx="64" cy="46" r="2" fill="#1e293b"/>
      <circle cx="68" cy="51" r="2.5" fill="#f472b6" opacity="0.6"/>
      <circle cx="33" cy="66" r="5" fill="#ffffff"/> <!-- tail -->
    </svg>`,
  },

  // 10. เปลวเทียนสว่างไสว
  {
    id: 'candle-flame',
    name: 'เปลวเทียนสว่างไสว',
    category: 'light',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="40%" stop-color="#fef08a"/>
          <stop offset="80%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#dc2626"/>
        </radialGradient>
      </defs>
      <rect x="42" y="55" width="16" height="38" fill="#fef08a" rx="2"/>
      <path d="M42 55 Q50 58 58 55" fill="#fef9c3"/>
      <line x1="50" y1="44" x2="50" y2="55" stroke="#78350f" stroke-width="2.5"/>
      <path d="M50 10 C62 24 64 38 58 45 C54 49 46 49 42 45 C36 38 38 24 50 10 Z" fill="url(#flameGrad)"/>
      <circle cx="50" cy="38" r="4" fill="#ffffff"/>
    </svg>`,
  },

  // 11. ธูปเทียนควันหอม
  {
    id: 'incense-smoke',
    name: 'ธูปเทียนควันหอม',
    category: 'light',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 3 Incenses -->
      <line x1="38" y1="35" x2="38" y2="85" stroke="#b91c1c" stroke-width="2.5"/>
      <line x1="50" y1="30" x2="50" y2="85" stroke="#b91c1c" stroke-width="2.5"/>
      <line x1="62" y1="35" x2="62" y2="85" stroke="#b91c1c" stroke-width="2.5"/>
      <!-- Glowing tips -->
      <circle cx="38" cy="35" r="2.5" fill="#ea580c"/>
      <circle cx="50" cy="30" r="3" fill="#ea580c"/>
      <circle cx="62" cy="35" r="2.5" fill="#ea580c"/>
      <!-- Smoke waves -->
      <path d="M38 33 Q30 20 40 10" stroke="#cbd5e1" stroke-width="1.5" fill="none" opacity="0.6"/>
      <path d="M50 28 Q60 18 50 8" stroke="#cbd5e1" stroke-width="1.5" fill="none" opacity="0.6"/>
      <path d="M62 33 Q70 20 62 10" stroke="#cbd5e1" stroke-width="1.5" fill="none" opacity="0.6"/>
    </svg>`,
  },

  // 12. ผางประทีปน้ำมันโบราณ
  {
    id: 'pratheep-lamp',
    name: 'ผางประทีปโบราณ',
    category: 'light',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Clay bowl -->
      <path d="M15 62 C15 78 30 85 50 85 C70 85 85 78 85 62 Z" fill="#9a3412"/>
      <ellipse cx="50" cy="62" rx="35" ry="10" fill="#c2410c"/>
      <ellipse cx="50" cy="63" rx="28" ry="7" fill="#78350f"/>
      <!-- Center flame -->
      <path d="M50 22 C58 35 60 50 55 58 C52 61 48 61 45 58 C40 50 42 35 50 22 Z" fill="#facc15"/>
      <path d="M50 32 C54 40 55 50 52 56 C50 58 48 58 46 56 C43 50 45 40 50 32 Z" fill="#ffffff"/>
    </svg>`,
  },

  // 13. พลุดอกไม้ไฟประกายทอง
  {
    id: 'firework-gold',
    name: 'พลุดอกไม้ไฟประกายทอง',
    category: 'decor',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="5" fill="#ffffff"/>
      <g stroke="#facc15" stroke-width="3" stroke-linecap="round">
        <line x1="50" y1="10" x2="50" y2="28"/>
        <line x1="50" y1="72" x2="50" y2="90"/>
        <line x1="10" y1="50" x2="28" y2="50"/>
        <line x1="72" y1="50" x2="90" y2="50"/>
        <line x1="22" y1="22" x2="35" y2="35"/>
        <line x1="65" y1="65" x2="78" y2="78"/>
        <line x1="22" y1="78" x2="35" y2="65"/>
        <line x1="65" y1="35" x2="78" y2="22"/>
      </g>
      <g fill="#fef08a">
        <circle cx="50" cy="5" r="3"/>
        <circle cx="50" cy="95" r="3"/>
        <circle cx="5" cy="50" r="3"/>
        <circle cx="95" cy="50" r="3"/>
        <circle cx="16" cy="16" r="3"/>
        <circle cx="84" cy="84" r="3"/>
        <circle cx="16" cy="84" r="3"/>
        <circle cx="84" cy="16" r="3"/>
      </g>
    </svg>`,
  },

  // 14. พลุดอกไม้ไฟหลากสี
  {
    id: 'firework-color',
    name: 'พลุดอกไม้ไฟเฉลิมฉลอง',
    category: 'decor',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g stroke-linecap="round" stroke-width="2.5">
        <line x1="50" y1="12" x2="50" y2="30" stroke="#f43f5e"/>
        <line x1="50" y1="70" x2="50" y2="88" stroke="#38bdf8"/>
        <line x1="12" y1="50" x2="30" y2="50" stroke="#22c55e"/>
        <line x1="70" y1="50" x2="88" y2="50" stroke="#facc15"/>
        <line x1="24" y1="24" x2="36" y2="36" stroke="#c084fc"/>
        <line x1="64" y1="64" x2="76" y2="76" stroke="#fb923c"/>
        <line x1="24" y1="76" x2="36" y2="64" stroke="#e879f9"/>
        <line x1="64" y1="36" x2="76" y2="24" stroke="#4ade80"/>
      </g>
      <circle cx="50" cy="50" r="4" fill="#ffffff"/>
    </svg>`,
  },

  // 15. ดอกบัวหลวงสีชมพู
  {
    id: 'lotus-flower',
    name: 'ดอกบัวหลวงบานบริสุทธิ์',
    category: 'thai',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15 C40 38 32 60 42 75 C48 80 52 80 58 75 C68 60 60 38 50 15 Z" fill="#ec4899"/>
      <path d="M35 35 C20 48 18 68 28 78 C35 82 45 80 48 74 C38 62 38 48 35 35 Z" fill="#f472b6"/>
      <path d="M65 35 C80 48 82 68 72 78 C65 82 55 80 52 74 C62 62 62 48 65 35 Z" fill="#f472b6"/>
      <path d="M50 25 C44 42 40 58 46 68 C48 72 52 72 54 68 C60 58 56 42 50 25 Z" fill="#fbcfe8"/>
      <ellipse cx="50" cy="74" rx="10" ry="5" fill="#facc15"/>
    </svg>`,
  },

  // 16. พวงมาลัยดอกมะลิ
  {
    id: 'jasmine-garland',
    name: 'พวงมาลัยดอกมะลิ',
    category: 'thai',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="42" r="28" fill="none" stroke="#f1f5f9" stroke-width="12"/>
      <circle cx="50" cy="42" r="28" fill="none" stroke="#e2e8f0" stroke-width="6" stroke-dasharray="5 5"/>
      <!-- Bow ribbon -->
      <path d="M40 68 L50 78 L60 68 L50 62 Z" fill="#ef4444"/>
      <line x1="46" y1="78" x2="40" y2="95" stroke="#ef4444" stroke-width="4"/>
      <line x1="54" y1="78" x2="60" y2="95" stroke="#ef4444" stroke-width="4"/>
      <!-- Flower pendant -->
      <circle cx="40" cy="95" r="4" fill="#facc15"/>
      <circle cx="60" cy="95" r="4" fill="#facc15"/>
    </svg>`,
  },

  // 17. ดอกดาวเรืองมงคล
  {
    id: 'marigold-flower',
    name: 'ดอกดาวเรืองมงคล',
    category: 'thai',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mariGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="60%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#mariGrad)"/>
      <g fill="#ca8a04">
        <circle cx="36" cy="36" r="6"/>
        <circle cx="64" cy="36" r="6"/>
        <circle cx="36" cy="64" r="6"/>
        <circle cx="64" cy="64" r="6"/>
        <circle cx="50" cy="30" r="7"/>
        <circle cx="50" cy="70" r="7"/>
        <circle cx="30" cy="50" r="7"/>
        <circle cx="70" cy="50" r="7"/>
      </g>
      <circle cx="50" cy="50" r="14" fill="#fef08a"/>
    </svg>`,
  },

  // 18. ข้อความ "สุขสันต์วันลอยกระทง"
  {
    id: 'badge-happy-loy-krathong',
    name: 'สุขสันต์วันลอยกระทง (ไทย)',
    category: 'text',
    svgString: `<svg viewBox="0 0 160 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="152" height="52" rx="26" fill="#b45309" stroke="#facc15" stroke-width="3"/>
      <rect x="8" y="8" width="144" height="44" rx="22" fill="#78350f"/>
      <text x="80" y="36" font-family="'Kanit', sans-serif" font-weight="bold" font-size="16" fill="#fef08a" text-anchor="middle">
        สุขสันต์วันลอยกระทง
      </text>
    </svg>`,
  },

  // 19. ข้อความ "Loy Krathong Festival"
  {
    id: 'badge-loy-krathong-en',
    name: 'Loy Krathong Festival (อังกฤษ)',
    category: 'text',
    svgString: `<svg viewBox="0 0 160 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="152" height="52" rx="14" fill="#1e3a8a" stroke="#60a5fa" stroke-width="3"/>
      <rect x="8" y="8" width="144" height="44" rx="10" fill="#172554"/>
      <text x="80" y="27" font-family="'Kanit', sans-serif" font-weight="bold" font-size="12" fill="#93c5fd" text-anchor="middle">
        LOY KRATHONG
      </text>
      <text x="80" y="44" font-family="'Kanit', sans-serif" font-weight="bold" font-size="13" fill="#fef08a" text-anchor="middle">
        FESTIVAL
      </text>
    </svg>`,
  },

  // 20. ตราประทับ "เทศบาล ๕ วัดพระปฐมเจดีย์"
  {
    id: 'badge-school-stamp',
    name: 'เทศบาล ๕ วัดพระปฐมเจดีย์',
    category: 'text',
    svgString: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="54" fill="#1e3a8a" stroke="#fbbf24" stroke-width="3"/>
      <circle cx="60" cy="60" r="46" fill="none" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="3 3"/>
      <!-- Stupa mini -->
      <path d="M60 22 L62 38 L58 38 Z" fill="#fbbf24"/>
      <path d="M55 42 C48 50 48 58 46 62 L74 62 C72 58 72 50 65 42 Z" fill="#fbbf24"/>
      <rect x="44" y="62" width="32" height="4" fill="#eab308"/>
      <text x="60" y="78" font-family="'Kanit', sans-serif" font-weight="bold" font-size="9" fill="#ffffff" text-anchor="middle">
        เทศบาล ๕
      </text>
      <text x="60" y="92" font-family="'Kanit', sans-serif" font-weight="500" font-size="8" fill="#fef08a" text-anchor="middle">
        วัดพระปฐมเจดีย์
      </text>
    </svg>`,
  },

  // 21. ปลาตะเพียนใบลานมงคล
  {
    id: 'woven-fish',
    name: 'ปลาตะเพียนใบลานมงคล',
    category: 'thai',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 50 L50 25 L75 50 L50 75 Z" fill="#dc2626"/>
      <path d="M35 50 L50 35 L65 50 L50 65 Z" fill="#facc15"/>
      <line x1="25" y1="50" x2="75" y2="50" stroke="#b91c1c" stroke-width="2"/>
      <line x1="50" y1="25" x2="50" y2="75" stroke="#b91c1c" stroke-width="2"/>
      <!-- Tail fins -->
      <path d="M25 50 L6 34 L12 50 L6 66 Z" fill="#dc2626"/>
      <path d="M50 25 L40 10 L50 14 L60 10 Z" fill="#dc2626"/>
      <path d="M50 75 L40 90 L50 86 L60 90 Z" fill="#dc2626"/>
      <circle cx="70" cy="46" r="2.5" fill="#ffffff"/>
    </svg>`,
  },

  // 22. ประกายดาววิบวับ
  {
    id: 'sparkle-stars',
    name: 'ประกายดาววิบวับ',
    category: 'decor',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Main star -->
      <path d="M50 10 Q50 40 20 50 Q50 50 50 80 Q50 50 80 50 Q50 50 50 10" fill="#fef08a"/>
      <!-- Small stars -->
      <path d="M22 18 Q22 28 12 32 Q22 32 22 42 Q22 32 32 32 Q22 32 22 18" fill="#ffffff"/>
      <path d="M78 64 Q78 74 68 78 Q78 78 78 88 Q78 78 88 78 Q78 78 78 64" fill="#fbbf24"/>
    </svg>`,
  },

  // 23. หัวใจลายไทยทองคำ
  {
    id: 'thai-heart',
    name: 'หัวใจกนกทองคำ',
    category: 'thai',
    svgString: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 85 C15 62 10 32 30 20 C42 12 48 20 50 26 C52 20 58 12 70 20 C90 32 85 62 50 85 Z" fill="#b45309" stroke="#facc15" stroke-width="4"/>
      <path d="M50 75 C24 55 20 32 35 24 C44 18 48 24 50 28 C52 24 56 18 65 24 C80 32 76 55 50 75 Z" fill="#facc15"/>
      <circle cx="50" cy="42" r="6" fill="#fef08a"/>
    </svg>`,
  },

  // 24. ระลอกคลื่นน้ำสะท้อนแสง
  {
    id: 'water-waves',
    name: 'ระลอกคลื่นแม่น้ำยามค่ำ',
    category: 'decor',
    svgString: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20 Q35 5 60 20 Q85 35 110 20" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M20 38 Q45 25 70 38 Q95 50 120 38" stroke="#0284c7" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="60" cy="22" r="2" fill="#ffffff"/>
      <circle cx="90" cy="36" r="2" fill="#ffffff"/>
    </svg>`,
  },
];
