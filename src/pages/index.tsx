import { db } from "@/server/db";
import { api } from "@/utils/api";
import {
  SignInButton,
  SignUpButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
console.log("getServerSideProps", userId)
  if (userId) {
    // const profile = await db.profile.findFirst({
    //   where: {
    //     userId: userId,
    //   },
    // });
  }

  return { props: {} };
};

export default function Home() {
  const { isSignedIn } = useUser();

  // const { data: profileData } = api.profile.getProfile.useQuery(void {}, {
  //   enabled: isSignedIn,
  // });
  return (
    <section className="mt-10 flex flex-col gap-8">
      <h1 className="text-center font-sans text-5xl font-extrabold tracking-tight">
        Investor Portal
      </h1>
      {isSignedIn ? (
        <div className="flex flex-col gap-5">
          <SignOutButton>
            <button className="mx-auto w-min whitespace-nowrap border border-rose-900 bg-gradient-to-br from-rose-500 to-rose-700 px-10 py-2 text-2xl tracking-wide text-neutral-100 shadow-md">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      ) : (
        <div className="mx-auto flex flex-col gap-4">
          <SignUpButton>
            <button className="mx-auto w-min whitespace-nowrap border border-indigo-900 bg-gradient-to-br from-indigo-500 to-indigo-700 px-10 py-2 text-2xl tracking-wide text-neutral-100 shadow-md">
              Sign Up
            </button>
          </SignUpButton>
          <SignInButton redirectUrl="/">
            <button className="text-center text-lg font-bold text-indigo-900">
              Or Login
            </button>
          </SignInButton>
        </div>
      )}
    </section>
  );
}
