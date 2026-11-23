import { useEffect, useState } from 'react';
import { getPosts } from './getPosts';
import { PostData, NewPostData } from './types';
import { PostsList } from './PostsList';
import { NewPostForm } from './NewPostForm';

export function PostsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<PostData[]>([]); // state is updated.
  useEffect(() => {
    let cancel = false;
    getPosts().then((data: any) => {
      if (!cancel) {
        setPosts(data); // state change in 'posts'
        setIsLoading(false); // state change in 'isLoading'
      }
    });
    return () => {
      cancel = true;
    };
  }, []);

  if (isLoading) {
    return <div className="w-96 mx-auto mt-6">Loading ...</div>;
  }

  function handleSave(x: any) {
    console.log(x);
  }
  return (
    <div className="w-96 mx-auto mt-6">
      <h2 className="text-xl text-slate-900 font-bold">Posts</h2>
      {/* <NewPostForm onSave={handleSave} />
      <PostsList posts={posts} /> */}

      <PostsList posts={posts} />
      <NewPostForm onSave={handleSave} />
    </div>
  );
}
