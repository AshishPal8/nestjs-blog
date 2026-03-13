import Feed from "@/src/components/home/feed";
import FeedLayout from "@/src/components/shared/FeedLayout";
import { getPosts } from "@/src/lib/data/post";
import { PostsData } from "@/src/types/post.types";

export default async function Home() {
  const data = (await getPosts()) as PostsData;

  return (
    <FeedLayout>
      <Feed initialData={data} />
    </FeedLayout>
  );
}
