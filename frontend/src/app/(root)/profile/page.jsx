import { redirect } from "next/navigation";
import { getClient } from "@/src/lib/apollo-server-client";
import { GET_ME } from "@/src/graphql/queries/user";
import { GET_MY_STATS } from "@/src/graphql/queries/activity";
import ProfileClient from "./components/profile-client";
import FeedLayout from "@/src/components/shared/FeedLayout";

const ProfilePage = async () => {
  const client = await getClient();

  let user = null;

  try {
    const { data } = await client.query({
      query: GET_ME,
      fetchPolicy: "no-cache",
    });
    user = data?.me ?? null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }

  if (!user) redirect("/");

  let stats = null;

  try {
    const { data } = await client.query({
      query: GET_MY_STATS,
      fetchPolicy: "no-cache",
    });
    stats = data?.myStats ?? null;
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
  }

  return (
    <FeedLayout>
      <ProfileClient user={user} stats={stats} />
    </FeedLayout>
  );
};

export default ProfilePage;
