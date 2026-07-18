import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function createSVG(elements, viewBox = "0 0 800 600") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">
    <rect width="100%" height="100%" fill="#ffffff"/>
    ${elements}
  </svg>`;
}

// Common styles: stroke="#000000" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"
const st = 'stroke="#000000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"';
const fillBlack = 'fill="#000000"';

const illustrations = {
  'singer': `<circle cx="400" cy="250" r="60" ${st}/>
             <path d="M400 310 L400 450 M340 450 L460 450" ${st}/>
             <path d="M350 250 A 50 50 0 0 0 450 250" ${st}/>
             <circle cx="360" cy="240" r="10" ${fillBlack}/>
             <circle cx="440" cy="240" r="10" ${fillBlack}/>
             <path d="M400 280 C410 280 420 270 420 270" ${st}/>
             <rect x="480" y="220" width="30" height="80" rx="15" ${st}/>
             <path d="M495 300 L495 400" ${st}/>`,
             
  'dj': `<rect x="250" y="300" width="300" height="150" rx="20" ${st}/>
         <circle cx="330" cy="375" r="40" ${st}/>
         <circle cx="470" cy="375" r="40" ${st}/>
         <path d="M330 375 L350 375 M470 375 L490 375" ${st}/>
         <circle cx="400" cy="200" r="60" ${st}/>
         <path d="M340 200 C340 150 460 150 460 200" ${st} stroke-dasharray="10 20"/>
         <path d="M400 260 L400 300" ${st}/>
         <path d="M300 230 L340 300 M500 230 L460 300" ${st}/>`,
         
  'music_producer': `<rect x="200" y="250" width="400" height="200" rx="20" ${st}/>
                     <rect x="240" y="290" width="40" height="120" ${st}/>
                     <rect x="300" y="290" width="40" height="120" ${st}/>
                     <rect x="360" y="290" width="40" height="120" ${st}/>
                     <rect x="420" y="290" width="40" height="120" ${st}/>
                     <rect x="480" y="290" width="40" height="120" ${st}/>
                     <rect x="540" y="290" width="40" height="120" ${st}/>
                     <circle cx="400" cy="150" r="50" ${st}/>
                     <path d="M350 150 A 60 60 0 0 1 450 150" ${st}/>`,

  'guitarist': `<path d="M250 450 L550 150" ${st}/>
                <rect x="450" y="200" width="80" height="140" rx="40" transform="rotate(45 450 200)" ${st}/>
                <circle cx="450" cy="280" r="20" ${fillBlack}/>
                <circle cx="350" cy="300" r="50" ${st}/>
                <path d="M350 350 L350 500" ${st}/>`,

  'pianist': `<rect x="200" y="300" width="400" height="100" rx="10" ${st}/>
              <rect x="220" y="300" width="30" height="60" ${fillBlack}/>
              <rect x="280" y="300" width="30" height="60" ${fillBlack}/>
              <rect x="360" y="300" width="30" height="60" ${fillBlack}/>
              <rect x="420" y="300" width="30" height="60" ${fillBlack}/>
              <rect x="480" y="300" width="30" height="60" ${fillBlack}/>
              <circle cx="400" cy="180" r="60" ${st}/>
              <path d="M350 240 L300 290 M450 240 L500 290" ${st}/>`,

  'drummer': `<circle cx="400" cy="400" r="80" ${st}/>
              <circle cx="280" cy="320" r="60" ${st}/>
              <circle cx="520" cy="320" r="60" ${st}/>
              <circle cx="400" cy="200" r="50" ${st}/>
              <path d="M350 250 L280 300 M450 250 L520 300" ${st}/>
              <path d="M220 200 L280 260 M580 200 L520 260" ${st}/>`,

  'saxophonist': `<circle cx="350" cy="200" r="50" ${st}/>
                  <path d="M350 250 L350 400 A 50 50 0 0 0 450 400 L450 350" ${st}/>
                  <circle cx="450" cy="350" r="30" ${fillBlack}/>
                  <path d="M330 300 L370 300 M330 330 L370 330 M330 360 L370 360" ${st}/>`,

  'videographer': `<rect x="250" y="250" width="200" height="150" rx="20" ${st}/>
                   <path d="M450 280 L550 230 L550 420 L450 370" ${fillBlack} ${st}/>
                   <circle cx="350" cy="325" r="40" ${st}/>
                   <circle cx="350" cy="325" r="15" ${fillBlack}/>
                   <path d="M300 250 L350 200 L400 250" ${st}/>`,

  'photographer': `<rect x="250" y="250" width="300" height="200" rx="20" ${st}/>
                   <circle cx="400" cy="350" r="60" ${st}/>
                   <circle cx="400" cy="350" r="25" ${fillBlack}/>
                   <rect x="300" y="210" width="80" height="40" rx="10" ${st}/>
                   <circle cx="500" cy="290" r="15" ${fillBlack}/>`,

  'graphic_designer': `<path d="M250 400 L550 400 L400 150 Z" ${st}/>
                       <circle cx="400" cy="280" r="40" ${st}/>
                       <circle cx="400" cy="280" r="15" ${fillBlack}/>
                       <circle cx="300" cy="360" r="15" ${fillBlack}/>
                       <circle cx="500" cy="360" r="15" ${fillBlack}/>`,

  'ui_ux_designer': `<rect x="250" y="200" width="300" height="200" rx="20" ${st}/>
                     <rect x="290" y="240" width="220" height="120" rx="10" ${st}/>
                     <path d="M290 280 L510 280 M350 240 L350 360" ${st}/>
                     <circle cx="400" cy="320" r="20" ${fillBlack}/>`,

  'web_developer': `<rect x="200" y="200" width="400" height="250" rx="20" ${st}/>
                    <path d="M200 260 L600 260" ${st}/>
                    <circle cx="240" cy="230" r="10" ${fillBlack}/>
                    <circle cx="280" cy="230" r="10" ${st}/>
                    <path d="M280 320 L240 360 L280 400 M340 320 L380 360 L340 400 M460 300 L420 420" ${st}/>`,

  'mobile_developer': `<rect x="320" y="150" width="160" height="300" rx="30" ${st}/>
                       <path d="M380 180 L420 180" ${st}/>
                       <circle cx="400" cy="410" r="15" ${st}/>
                       <rect x="350" y="220" width="100" height="150" rx="10" ${st}/>
                       <path d="M370 260 L430 260 M370 300 L410 300" ${st}/>`,

  'content_creator': `<rect x="280" y="250" width="240" height="180" rx="20" ${st}/>
                      <circle cx="400" cy="180" r="50" ${st}/>
                      <path d="M400 250 L400 300" ${st}/>
                      <path d="M370 320 L430 320 L400 370 Z" ${fillBlack}/>
                      <path d="M200 300 L280 340 M600 300 L520 340" ${st}/>`,

  'podcaster': `<rect x="360" y="200" width="80" height="140" rx="40" ${st}/>
                <path d="M320 280 A 80 80 0 0 0 480 280" ${st}/>
                <path d="M400 360 L400 450" ${st}/>
                <path d="M350 450 L450 450" ${st}/>
                <circle cx="400" cy="120" r="40" ${st}/>
                <path d="M350 120 C 350 80 450 80 450 120" ${st}/>`,

  'dancer': `<path d="M400 150 Q 450 250 400 350 T 400 500" ${st}/>
             <circle cx="400" cy="100" r="40" ${st}/>
             <path d="M400 200 Q 300 150 250 250" ${st}/>
             <path d="M400 200 Q 500 150 550 250" ${st}/>
             <path d="M400 350 Q 300 400 250 500" ${st}/>
             <path d="M400 350 Q 500 400 550 500" ${st}/>`,

  'actor': `<path d="M300 250 C 300 150 450 150 450 250 C 450 350 300 350 300 250" ${st}/>
            <path d="M350 250 C 350 150 500 150 500 250 C 500 350 350 350 350 250" ${st}/>
            <circle cx="340" cy="230" r="10" ${fillBlack}/>
            <path d="M330 270 Q 350 290 370 270" ${st}/>
            <circle cx="460" cy="230" r="10" ${fillBlack}/>
            <path d="M430 270 Q 450 250 470 270" ${st}/>`,

  'event_host': `<circle cx="400" cy="200" r="50" ${st}/>
                 <rect x="380" y="300" width="40" height="80" rx="20" ${st}/>
                 <path d="M340 340 A 60 60 0 0 0 460 340" ${st}/>
                 <path d="M400 400 L400 480" ${st}/>
                 <path d="M350 280 L400 300 L450 280" ${st}/>
                 <path d="M300 350 L350 300 M500 350 L450 300" ${st}/>`,

  'fashion_creator': `<path d="M300 450 L350 200 L450 200 L500 450" ${st}/>
                      <circle cx="400" cy="140" r="40" ${st}/>
                      <path d="M350 200 L250 300 M450 200 L550 300" ${st}/>
                      <path d="M340 300 L460 300 M320 380 L480 380" ${st}/>`,

  'digital_artist': `<rect x="200" y="250" width="300" height="200" rx="20" ${st}/>
                     <path d="M450 150 L550 250 L520 280 L420 180 Z" ${st} fill="#000"/>
                     <path d="M420 180 L400 160 L450 150" ${fillBlack}/>
                     <circle cx="300" cy="350" r="40" ${st}/>
                     <path d="M250 250 C 250 150 450 150 450 250" ${st}/>`,

  'event_organizer': `<rect x="250" y="200" width="300" height="250" rx="20" ${st}/>
                      <path d="M250 280 L550 280" ${st}/>
                      <path d="M320 150 L320 250 M480 150 L480 250" ${st}/>
                      <rect x="300" y="320" width="60" height="60" rx="10" ${st}/>
                      <rect x="400" y="320" width="100" height="20" rx="10" ${fillBlack}/>
                      <rect x="400" y="360" width="60" height="20" rx="10" ${st}/>`,

  'creative_team': `<circle cx="300" cy="250" r="50" ${st}/>
                    <circle cx="500" cy="250" r="50" ${st}/>
                    <circle cx="400" cy="400" r="50" ${st}/>
                    <path d="M300 300 L400 400 M500 300 L400 400 M300 250 L500 250" ${st}/>
                    <circle cx="400" cy="250" r="15" ${fillBlack}/>
                    <circle cx="350" cy="325" r="15" ${fillBlack}/>
                    <circle cx="450" cy="325" r="15" ${fillBlack}/>`,

  'client_hiring': `<circle cx="280" cy="250" r="60" ${st}/>
                    <path d="M200 400 C 200 320 360 320 360 400" ${st}/>
                    <rect x="460" y="200" width="160" height="200" rx="10" ${st}/>
                    <circle cx="540" cy="260" r="20" ${fillBlack}/>
                    <path d="M500 320 L580 320 M500 350 L560 350" ${st}/>
                    <path d="M360 280 L460 280" ${st}/>`,

  'creator_browsing': `<circle cx="400" cy="200" r="60" ${st}/>
                       <path d="M280 450 C 280 350 520 350 520 450" ${st}/>
                       <rect x="300" y="380" width="200" height="120" rx="10" ${st} fill="#fff"/>
                       <path d="M350 440 L450 440" ${st}/>`,

  'portfolio_showcase': `<rect x="200" y="150" width="400" height="300" rx="20" ${st}/>
                         <path d="M200 230 L600 230" ${st}/>
                         <circle cx="240" cy="190" r="10" ${fillBlack}/>
                         <circle cx="280" cy="190" r="10" ${st}/>
                         <circle cx="320" cy="190" r="10" ${st}/>
                         <rect x="250" y="270" width="120" height="120" rx="10" ${st}/>
                         <rect x="400" y="270" width="150" height="30" rx="10" ${fillBlack}/>
                         <rect x="400" y="320" width="100" height="20" rx="10" ${st}/>
                         <rect x="400" y="360" width="80" height="20" rx="10" ${st}/>`,

  'messaging': `<path d="M250 250 C 250 150 550 150 550 250 C 550 350 450 350 400 350 L300 400 L320 320 C 280 300 250 280 250 250 Z" ${st}/>
                <circle cx="350" cy="250" r="15" ${fillBlack}/>
                <circle cx="450" cy="250" r="15" ${fillBlack}/>
                <path d="M450 400 C 450 480 650 480 650 400 C 650 320 550 320 500 320 L500 400 Z" ${st}/>`,

  'booking': `<rect x="250" y="180" width="300" height="260" rx="20" ${st}/>
              <path d="M250 260 L550 260" ${st}/>
              <path d="M320 140 L320 220 M480 140 L480 220" ${st}/>
              <circle cx="330" cy="330" r="20" ${st}/>
              <circle cx="400" cy="330" r="20" ${fillBlack}/>
              <circle cx="470" cy="330" r="20" ${st}/>
              <circle cx="330" cy="390" r="20" ${st}/>
              <circle cx="400" cy="390" r="20" ${st}/>
              <circle cx="470" cy="390" r="20" ${st}/>`,

  'payments': `<rect x="220" y="200" width="360" height="220" rx="20" ${st}/>
               <path d="M220 280 L580 280" ${st}/>
               <rect x="280" y="340" width="80" height="40" rx="10" ${fillBlack}/>
               <circle cx="480" cy="360" r="20" ${st}/>
               <circle cx="520" cy="360" r="20" ${st}/>`,

  'verification': `<path d="M400 150 L500 200 L500 320 L400 450 L300 320 L300 200 Z" ${st}/>
                   <path d="M350 300 L390 340 L460 250" ${st}/>`,

  'analytics': `<path d="M200 450 L600 450" ${st}/>
                <path d="M200 450 L200 150" ${st}/>
                <rect x="260" y="300" width="60" height="150" rx="10" ${st}/>
                <rect x="360" y="200" width="60" height="250" rx="10" ${fillBlack}/>
                <rect x="460" y="100" width="60" height="350" rx="10" ${st}/>
                <path d="M250 250 L350 150 L450 250 L550 50" ${st}/>`,

  'community': `<circle cx="400" cy="200" r="60" ${st}/>
                <path d="M300 350 C 300 270 500 270 500 350" ${st}/>
                <circle cx="250" cy="280" r="40" ${st}/>
                <path d="M170 420 C 170 360 330 360 330 420" ${st}/>
                <circle cx="550" cy="280" r="40" ${st}/>
                <path d="M470 420 C 470 360 630 360 630 420" ${st}/>`,

  'success_celebration': `<circle cx="400" cy="250" r="60" ${st}/>
                          <path d="M320 450 C 320 350 480 350 480 450" ${st}/>
                          <path d="M300 300 L220 220 M500 300 L580 220" ${st}/>
                          <circle cx="200" cy="200" r="10" ${st}/>
                          <circle cx="600" cy="200" r="10" ${st}/>
                          <path d="M220 150 L250 180 M580 150 L550 180" ${st}/>
                          <path d="M150 220 L180 250 M650 220 L620 250" ${st}/>
                          <path d="M350 240 L370 260 L420 210" ${st}/>`
};

Object.entries(illustrations).forEach(([name, elements]) => {
  const svg = createSVG(elements);
  fs.writeFileSync(path.join(imagesDir, `${name}.svg`), svg);
});

console.log(`Successfully generated ${Object.keys(illustrations).length} unified SVGs.`);
