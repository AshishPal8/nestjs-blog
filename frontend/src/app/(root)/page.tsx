import Feed from "@/src/components/home/feed";
import { GET_POSTS } from "@/src/graphql/queries/posts";
import { getClient } from "@/src/lib/apollo-server-client";
import { PostsData } from "@/src/types/post.types";

export default async function Home() {
  const { data } = await getClient().query<PostsData>({
    query: GET_POSTS,
    variables: { pagination: { page: 1, limit: 10 } },
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] justify-center">
      <Feed initialData={data} />
    </div>
  );
}
