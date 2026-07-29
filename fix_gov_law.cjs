const fs = require('fs');

let code = fs.readFileSync('src/pages/TermsAndConditions.tsx', 'utf8');

code = code.replace(
  "{ id: 'changes', title: '12. Changes to these Terms' },",
  "{ id: 'governing-law', title: '12. Governing Law' },\n  { id: 'changes', title: '13. Changes to these Terms' },"
);

code = code.replace(
  "{ id: 'contact', title: '13. Contact Information' },",
  "{ id: 'contact', title: '14. Contact Information' },"
);

const governingLawContent = `
  'governing-law': (
    <>
      <p>These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction within Africa where GigsConnect operates, without regard to its conflict of law provisions.</p>
      <p>Any dispute arising from these Terms or your use of the Platform will be subject to the exclusive jurisdiction of the competent courts in that jurisdiction, although we retain the right to bring proceedings against you for breach of these conditions in your country of residence.</p>
    </>
  ),
`;

code = code.replace(
  "'changes': (",
  governingLawContent + "  'changes': ("
);

fs.writeFileSync('src/pages/TermsAndConditions.tsx', code);
