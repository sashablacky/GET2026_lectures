import { assertIsPosts } from './posts/getPosts';

export async function getPost() {
  const response = await fetch(process.env.REACT_APP_API_URL!);

  const body = (await response.json()) as unknown;
  assertIsPosts(body);
  return body;
}
