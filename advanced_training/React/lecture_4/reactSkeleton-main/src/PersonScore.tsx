import { getPerson } from './getPerson';
import { useEffect, useState, useCallback } from 'react';
import { Reset } from './Reset';

export function PersonScore() {
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPerson().then((person: any) => {
      setLoading(false);
      setName(person.name);
    });
  });

  const callBack1 = useCallback(() => setScore(0), []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <h3>
          {name},{score}
        </h3>
      )}
      <div>
        <button onClick={() => setScore(score + 1)}> Add </button>
      </div>
      <div>
        <button onClick={() => setScore(score - 1)}> Subtract </button>
      </div>
      <Reset propMethod={callBack1} />
    </div>
  );
}
