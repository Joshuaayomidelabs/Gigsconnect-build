const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("import { FeaturedCreators }\nimport Pricing from './pages/Pricing';\nimport Settings from './pages/Settings'; from './pages/FeaturedCreators';", "import { FeaturedCreators } from './pages/FeaturedCreators';\nimport Pricing from './pages/Pricing';\nimport Settings from './pages/Settings';");

fs.writeFileSync('src/App.tsx', content);
