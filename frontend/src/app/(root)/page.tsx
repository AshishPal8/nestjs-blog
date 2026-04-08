import Feed from "@/src/components/home/feed";
import FeedLayout from "@/src/components/shared/FeedLayout";
import { GET_POSTS } from "@/src/graphql/queries/posts";
import { query } from "@/src/lib/apollo-server-client";
import { PostsData } from "@/src/types/post.types";

export default async function Home() {
  const feedData = await query<PostsData>({
    query: GET_POSTS,
    variables: { pagination: { page: 1, limit: 10 } },
  });

  return (
    <FeedLayout>
      <Feed initialData={feedData.data} />
    </FeedLayout>
  );
}
