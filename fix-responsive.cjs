const fs = require('fs');
let file = fs.readFileSync('src/pages/Landing.tsx', 'utf8');

// 1. Hero adjustments
file = file.replace(/className="lg:col-span-6 relative w-full h-\[500px\] lg:h-\[600px\]"/g, 'className="lg:col-span-6 relative w-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center py-10 lg:py-0"');
file = file.replace(/w-\[90%\] max-w-\[600px\] aspect-square rounded-\[3rem\]/g, 'w-[90%] max-w-[400px] lg:max-w-[500px] xl:max-w-[550px] aspect-square rounded-[3rem]');

// 2. Steps illustrations
// We want to avoid oversized illustrations on mobile for the steps.
file = file.replace(/<div className="w-full aspect-square mb-8 rounded-3xl/g, '<div className="w-[80%] max-w-[240px] md:w-full md:max-w-none mx-auto aspect-square mb-8 rounded-3xl');

// 3. Discover sections illustrations (they are w-full aspect-square right now)
// "lg:w-1/2 w-full" -> let's make sure the inner div is not huge. 
// "w-full aspect-square rounded-[3rem] overflow-hidden bg-white shadow"
// We can use max-w-[400px] mx-auto on mobile, and max-w-none on lg.
file = file.replace(/<div className="w-full aspect-square rounded-\[3rem\]/g, '<div className="w-full max-w-[400px] lg:max-w-none mx-auto aspect-square rounded-[3rem]');

// 4. Lazy loading
let imgCount = 0;
file = file.replace(/<img\s+src="([^"]+)"\s+alt="([^"]*)"/g, (match, src, alt) => {
  imgCount++;
  if (imgCount === 1) {
    return match; // First image, keep eager
  }
  // Make sure it doesn't already have loading="lazy"
  if (match.includes('loading=')) {
    return match;
  }
  return `<img src="${src}" alt="${alt}" loading="lazy"`;
});

// For images that use dynamic src: <img src={step.img} alt={step.title} className=... />
file = file.replace(/<img\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}/g, (match, src, alt) => {
  if (match.includes('loading=')) {
    return match;
  }
  return `<img src={${src}} alt={${alt}} loading="lazy"`;
});

fs.writeFileSync('src/pages/Landing.tsx', file);
