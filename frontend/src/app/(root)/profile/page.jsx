import { redirect } from "next/navigation";
import { getClient } from "@/src/lib/apollo-server-client";
import { GET_ME } from "@/src/graphql/queries/user";
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

  return (
    <FeedLayout>
      <ProfileClient user={user} />
    </FeedLayout>
  );
};

export default ProfilePage;
