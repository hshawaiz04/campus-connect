'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle } from 'lucide-react';

const questions = [
  {
    category: "Quantitative",
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 meters", "150 meters", "180 meters", "200 meters"],
    answer: "150 meters"
  },
  {
    category: "Quantitative",
    question: "What is 3/7 of 140?",
    options: ["30", "40", "60", "70"],
    answer: "60"
  },
  {
    category: "Quantitative",
    question: "A man buys an article for $27.50 and sells it for $28.60. Find his gain percent.",
    options: ["3%", "4%", "5%", "6%"],
    answer: "4%"
  },
  {
    category: "Verbal Ability",
    question: "Choose the word that is most nearly opposite in meaning to 'Ebullient'.",
    options: ["Enthusiastic", "Depressed", "Calm", "Agitated"],
    answer: "Depressed"
  },
  {
    category: "Verbal Ability",
    question: "If you rearrange the letters 'CIFAIPC', you would have the name of a(n):",
    options: ["City", "Animal", "Ocean", "River"],
    answer: "Ocean"
  },
  {
    category: "Verbal Ability",
    question: "Odometer is to mileage as compass is to:",
    options: ["speed", "hiking", "needle", "direction"],
    answer: "direction"
  },
  {
    category: "General Knowledge",
    question: "Which number logically follows this series? 4, 6, 9, 6, 14, 6, ...",
    options: ["6", "17", "19", "21"],
    answer: "19"
  },
  {
    category: "General Knowledge",
    question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?",
    options: ["Grandfather", "Grandmother", "Daughter", "Granddaughter"],
    answer: "Granddaughter"
  },
  {
    category: "General Knowledge",
    question: "Look at this series: 22, 21, 23, 22, 24, 23, ... What number should come next?",
    options: ["22", "25", "26", "27"],
    answer: "25"
  },
  {
    category: "General Knowledge",
    question: "Which of the following is not a prime number?",
    options: ["31", "41", "51", "61"],
    answer: "51"
  }
];

export default function AptitudeTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);

  const handleOptionChange = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmit = () => {
    let finalScore = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        finalScore++;
      }
    });
    setScore(finalScore);
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(null);
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (score !== null) {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold font-headline">Test Complete!</h2>
        <p className="text-4xl font-bold text-primary">Your Score: {score} / {questions.length}</p>
        <p className="text-muted-foreground">You can now use this score in the recommendation tool for more accurate results.</p>
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Answers:</h3>
            {questions.map((q, index) => (
                <Card key={index} className="text-left">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-start gap-2">
                             {selectedAnswers[index] === q.answer ? <CheckCircle className="text-green-500 mt-1" /> : <XCircle className="text-red-500 mt-1" />}
                            {q.question}
                        </CardTitle>
                        <CardDescription>{q.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Your answer: <span className={selectedAnswers[index] === q.answer ? 'text-green-600' : 'text-red-600'}>{selectedAnswers[index] || "Not Answered"}</span></p>
                        {selectedAnswers[index] !== q.answer && <p>Correct answer: <span className="text-green-600">{q.answer}</span></p>}
                    </CardContent>
                </Card>
            ))}
        </div>
        <Button onClick={handleRetake} size="lg">Retake Test</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-8">
       <div className="space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-center text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</p>
       </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          <CardDescription>{currentQuestion.category}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswers[currentQuestionIndex]} onValueChange={handleOptionChange}>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                  <Label htmlFor={`q${currentQuestionIndex}-o${index}`} className="text-base font-normal">{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        {currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90">
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
