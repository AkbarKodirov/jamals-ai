export type Question = {
  id: number
  exam: 'SAT' | 'IELTS'
  section: string
  topic: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question: string
  passage?: string
  choices?: string[]
  correct?: string
  type?: 'essay' | 'speaking'
  explanation: string
}

export const fullQuestionBank: Question[] = [
  { id: 1, exam: 'SAT', section: 'Math', topic: 'Algebra', difficulty: 'Easy', question: 'If 3x − 7 = 11, what is x?', choices: ['4', '5', '6', '7'], correct: '6', explanation: '3x = 18 → x = 6.' },
  { id: 2, exam: 'SAT', section: 'Math', topic: 'Algebra', difficulty: 'Medium', question: 'Solve for x: 2(x + 4) = 18', choices: ['5', '7', '9', '11'], correct: '5', explanation: 'x + 4 = 9 → x = 5.' },
  { id: 3, exam: 'SAT', section: 'Math', topic: 'Advanced Algebra', difficulty: 'Hard', question: 'The quadratic x² − 6x + 5 = 0 has roots at:', choices: ['1 and 5', '2 and 3', '−1 and −5', '0 and 6'], correct: '1 and 5', explanation: 'Factors to (x−1)(x−5)=0.' },
  { id: 4, exam: 'SAT', section: 'Math', topic: 'Problem Solving', difficulty: 'Medium', question: 'A rectangle has length 12 and width 5. What is its area?', choices: ['17', '34', '60', '120'], correct: '60', explanation: 'Area = length × width = 60.' },
  { id: 5, exam: 'SAT', section: 'Math', topic: 'Geometry', difficulty: 'Hard', question: 'In a right triangle, legs are 6 and 8. What is the hypotenuse?', choices: ['10', '12', '14', '16'], correct: '10', explanation: 'Pythagorean theorem: 6² + 8² = 100 → √100 = 10.' },
  { id: 6, exam: 'SAT', section: 'Reading & Writing', topic: 'Vocabulary', difficulty: 'Medium', question: '“The scientist’s theory was met with skepticism.” The word “skepticism” most nearly means:', choices: ['enthusiasm', 'doubt', 'agreement', 'confusion'], correct: 'doubt', explanation: 'Skepticism = attitude of doubt.' },
  { id: 7, exam: 'SAT', section: 'Reading & Writing', topic: 'Inference', difficulty: 'Hard', question: 'Based on the passage, the author most likely believes that climate change:', choices: ['is exaggerated', 'requires immediate action', 'is unsolvable', 'affects only developing countries'], correct: 'requires immediate action', explanation: 'Tone and evidence point to urgency.' },
  { id: 8, exam: 'SAT', section: 'Reading & Writing', topic: 'Grammar', difficulty: 'Easy', question: 'Choose the correct sentence:', choices: ['The team are winning.', 'The team is winning.', 'The team be winning.', 'The team winning.'], correct: 'The team is winning.', explanation: 'Collective noun “team” takes singular verb.' },
  { id: 13, exam: 'SAT', section: 'Math', topic: 'Linear functions', difficulty: 'Medium', question: 'A taxi charges 8 000 so\'m to start plus 2 500 so\'m per km. Which function gives the cost C for d km?', choices: ['C = 8000d + 2500', 'C = 2500d + 8000', 'C = 10500d', 'C = 8000 − 2500d'], correct: 'C = 2500d + 8000', explanation: 'The per-km rate multiplies d; the fixed start fee is the constant term.' },
  { id: 14, exam: 'SAT', section: 'Math', topic: 'Systems of equations', difficulty: 'Medium', question: 'If x + y = 10 and x − y = 4, what is the value of x?', choices: ['3', '6', '7', '14'], correct: '7', explanation: 'Add the equations: 2x = 14, so x = 7.' },
  { id: 15, exam: 'SAT', section: 'Math', topic: 'Percentages', difficulty: 'Easy', question: 'A jacket costs 400 000 so\'m and is discounted 15%. What is the sale price?', choices: ['340 000', '345 000', '360 000', '385 000'], correct: '340 000', explanation: '15% of 400 000 is 60 000; 400 000 − 60 000 = 340 000.' },
  { id: 16, exam: 'SAT', section: 'Math', topic: 'Advanced math', difficulty: 'Hard', question: 'If f(x) = x² − 4x + c has exactly one real root, what is c?', choices: ['−4', '0', '2', '4'], correct: '4', explanation: 'One root means the discriminant is zero: 16 − 4c = 0, so c = 4.' },
  { id: 17, exam: 'SAT', section: 'Math', topic: 'Geometry & trig', difficulty: 'Hard', question: 'In a right triangle, sin A = 3/5. What is cos A?', choices: ['3/4', '4/5', '5/4', '5/3'], correct: '4/5', explanation: 'Opposite 3, hypotenuse 5, so adjacent is 4 (3-4-5 triangle). cos A = 4/5.' },
  { id: 18, exam: 'SAT', section: 'Math', topic: 'Data analysis', difficulty: 'Easy', question: 'The scores 70, 80, 80, 90 and 100 have what median?', choices: ['80', '84', '85', '90'], correct: '80', explanation: 'Ordered, the middle (3rd) value is 80.' },
  { id: 19, exam: 'SAT', section: 'Reading & Writing', topic: 'Transitions', difficulty: 'Medium', question: 'The experiment was repeated three times. ______, the results were nearly identical each time. Which choice completes the text most logically?', choices: ['However', 'Remarkably', 'Instead', 'Otherwise'], correct: 'Remarkably', explanation: 'The second sentence adds a notable, consistent outcome — not a contrast.' },
  { id: 20, exam: 'SAT', section: 'Reading & Writing', topic: 'Standard English', difficulty: 'Medium', question: 'Choose the correct punctuation: The museum’s newest exhibit ___ features textiles from Bukhara ___ opens on Friday.', choices: [', which ... ,', 'which ... ', '; which ... ;', ': which ... :'], correct: ', which ... ,', explanation: 'A nonessential clause is set off with a pair of commas.' },
  { id: 21, exam: 'SAT', section: 'Reading & Writing', topic: 'Words in context', difficulty: 'Hard', question: 'The critic’s review was so ______ that even the director’s admirers conceded several of its points. Which word fits best?', choices: ['cogent', 'verbose', 'tentative', 'frivolous'], correct: 'cogent', explanation: 'Admirers conceding points implies the review was convincing — cogent.' },
]
