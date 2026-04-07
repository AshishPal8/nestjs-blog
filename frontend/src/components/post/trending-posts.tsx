import Link from "next/link";
import Image from "next/image";
import { Post, PostsData } from "@/src/types/post.types";
import { GET_POSTS } from "@/src/graphql/queries/posts";
import { query } from "@/src/lib/apollo-server-client";

const TrendingSidebar = async () => {
  let posts: Post[] = [];

  try {
    const { data } = await query<PostsData>({
      query: GET_POSTS,
      variables: { pagination: { page: 1, limit: 5 } },
    });
    posts = data?.posts?.data ?? [];
  } catch {
    return null;
  }

  if (posts.length === 0) return null;

  return (
    <div className="sticky top-[150px] left-1/2 translate-x-1/2 space-y-4 w-[300px] bg-card p-2 rounded-md">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
        Trending
      </h2>

      <div className="flex flex-col gap-1">
        {posts.map((post) => (
          <Link key={post.id} href={`/p/${post.slug}`}>
            <div className="flex items-start gap-3 group p-2 rounded-lg hover:bg-card transition-colors">
              {post.images?.[0] && (
                <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={post.images[0].url}
                    fill
                    alt={post.title}
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingSidebar;
