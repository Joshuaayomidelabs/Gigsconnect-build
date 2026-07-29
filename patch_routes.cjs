const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const imports = `import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CommunityGuidelines from './pages/CommunityGuidelines';
import CookiePolicy from './pages/CookiePolicy';
import HelpCenter from './pages/HelpCenter';
import SafetyCenter from './pages/SafetyCenter';
import FAQs from './pages/FAQs';
import Pricing from './pages/Pricing';
`;

content = content.replace("import ProtectedRoute from './components/ProtectedRoute';", "import ProtectedRoute from './components/ProtectedRoute';\n" + imports);

const routes = `              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/community-guidelines" element={<CommunityGuidelines />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/safety-center" element={<SafetyCenter />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/pricing" element={<Pricing />} />
`;

content = content.replace("              {/* Protected Routes */}", routes + "              {/* Protected Routes */}");

fs.writeFileSync('src/App.tsx', content);
console.log('Routes patched');
