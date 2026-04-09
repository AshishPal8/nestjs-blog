import React from "react";
import { query } from "@/src/lib/apollo-server-client";
import { GET_ME } from "@/src/graphql/queries/user";

const ProfilePage = async () => {
  try {
    const { data } = await query({
      query: GET_ME,
      context: { fetchOptions: { cache: "no-store" } },
    });
    console.log(data);

    if (!data?.me) {
      redirect("/login");
    }

    return (
      <main className="min-h-screen bg-muted/30">
        {/* <ProfileClient initialUser={data.me} /> */}
      </main>
    );
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return (
      <div className="p-20 text-center">
        Failed to load profile. Please try again later.
      </div>
    );
  }
};

export default ProfilePage;
