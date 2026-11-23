import { NewPostData } from './posts/types';

export async function savePost(NewPostData: NewPostData) {
  const response = await fetch(process.env.REACT_APP_API_URL!, {
    method: 'POST',
    body: JSON.stringify(NewPostData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body = await response.json();
  return { ...NewPostData, ...body };
}
