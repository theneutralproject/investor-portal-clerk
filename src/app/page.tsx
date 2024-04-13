import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { api } from "@/trpc/server";
import styles from "./index.module.css";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  return <main className={styles.main}>deleted</main>;
}

// async function CrudShowcase() {
//   const latestPost = await api.post.getLatest();

//   return (
//     <div className={styles.showcaseContainer}>
//       {latestPost ? (
//         <p className={styles.showcaseText}>
//           Your most recent post: {latestPost.name}
//         </p>
//       ) : (
//         <p className={styles.showcaseText}>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
