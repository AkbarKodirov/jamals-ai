// The Digital SAT skill map, the same topics OnePrep and the College Board question bank use.
// Each topic carries the College Board question-bank skill code so the app can deep-link to
// the free official questions for that topic.
export const TOPICS = {
  EBRW: [
    { domain: 'Craft and Structure', topics: [['Cross-Text Connections', 'CTC'], ['Text Structure and Purpose', 'TSP'], ['Words in Context', 'WIC']] },
    { domain: 'Expression of Ideas', topics: [['Rhetorical Synthesis', 'SYN'], ['Transitions', 'TRA']] },
    { domain: 'Information and Ideas', topics: [['Central Ideas and Details', 'CID'], ['Command of Evidence', 'COE'], ['Inferences', 'INF']] },
    { domain: 'Standard English Conventions', topics: [['Boundaries', 'BOU'], ['Form, Structure, and Sense', 'FSS']] },
  ],
  MATH: [
    {
      domain: 'Algebra',
      topics: [
        ['Linear equations in one variable', 'H.A.'],
        ['Linear functions', 'H.B.'],
        ['Linear equations in two variables', 'H.C.'],
        ['Systems of two linear equations in two variables', 'H.D.'],
        ['Linear inequalities in one or two variables', 'H.E.'],
      ],
    },
    {
      domain: 'Advanced Math',
      topics: [
        ['Nonlinear functions', 'P.C.'],
        ['Nonlinear equations in one variable and systems of equations in two variables', 'P.B.'],
        ['Equivalent expressions', 'P.A.'],
      ],
    },
    {
      domain: 'Problem-Solving and Data Analysis',
      topics: [
        ['Ratios, rates, proportional relationships, and units', 'Q.A.'],
        ['Percentages', 'Q.B.'],
        ['One-variable data: Distributions and measures of center and spread', 'Q.C.'],
        ['Two-variable data: Models and scatterplots', 'Q.D.'],
        ['Probability and conditional probability', 'Q.E.'],
        ['Inference from sample statistics and margin of error', 'Q.F.'],
        ['Evaluating statistical claims: Observational studies and experiments', 'Q.G.'],
      ],
    },
    {
      domain: 'Geometry and Trigonometry',
      topics: [
        ['Area and volume', 'S.A.'],
        ['Lines, angles, and triangles', 'S.B.'],
        ['Right triangles and trigonometry', 'S.C.'],
        ['Circles', 'S.D.'],
      ],
    },
  ],
}

export const ALL_TOPICS = Object.entries(TOPICS).flatMap(([section, ds]) => ds.flatMap((d) => d.topics.map(([name, code]) => ({ section, domain: d.domain, name, code }))))

/** The coarse skill the rest of the app (analytics, plans, lessons) already uses. */
export const COARSE = {
  'Cross-Text Connections': 'Text structure & purpose',
  'Text Structure and Purpose': 'Text structure & purpose',
  'Words in Context': 'Words in context',
  'Rhetorical Synthesis': 'Rhetorical synthesis',
  Transitions: 'Transitions',
  'Central Ideas and Details': 'Central ideas & details',
  'Command of Evidence': 'Command of evidence',
  Inferences: 'Inferences',
  Boundaries: 'Standard English conventions',
  'Form, Structure, and Sense': 'Standard English conventions',
  Algebra: 'Algebra',
  'Advanced Math': 'Advanced math',
  'Problem-Solving and Data Analysis': 'Problem solving & data',
  'Geometry and Trigonometry': 'Geometry & trigonometry',
}
export const coarseOf = (topic, domain) => COARSE[topic] ?? COARSE[domain]
