import { getPerson } from './getPerson';
import { useEffect, useState, useMemo } from 'react';
import { Reset } from './Reset';

function expensiveFunction() {
  console.log('expencive function invoked');
  let sum = 0;
  for (let i = 0; i < 10000; i++) {
    sum++;
  }
  return sum;
}

export function PersonScore() {
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPerson().then((person: any) => {
      setLoading(false);
      setName(person.name);
      console.log('state values are ' + score);
    });
  });

  const expenciveCalculation = useMemo(() => expensiveFunction(), []);

  function handleReset() {
    setScore(0);
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <h3>
          {name},{score}
        </h3>
      )}
      <p>{expenciveCalculation}</p>
      <div>
        <button onClick={() => setScore(score + 1)}> Add </button>
      </div>
      <div>
        <button onClick={() => setScore(score - 1)}> Subtract </button>
      </div>
      <Reset onProp={handleReset} />
    </div>
  );
}
