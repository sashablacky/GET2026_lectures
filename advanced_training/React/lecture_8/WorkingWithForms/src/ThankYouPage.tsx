import { useParams } from 'react-router-dom';

export function ThankYouPage() {
  const { name } = useParams<{ name: string }>();
  return <div>tanks {name} well be in touch soon</div>;
}
