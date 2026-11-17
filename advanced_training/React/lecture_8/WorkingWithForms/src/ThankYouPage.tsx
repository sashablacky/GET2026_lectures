import { useParams } from 'react-router-dom';

export function ThankYouPage() {
  const { name } = useParams<{ name: string }>(); // {name:'Stoyan'}
  return <div> Thanks {name},We will be in touch shortly </div>;
}
