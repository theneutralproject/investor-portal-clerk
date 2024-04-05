import { RouterOutputs, api } from "@/utils/api";
import {
  SignInButton,
  SignUpButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";


type project = RouterOutputs["project"]["getAll"][number]

const ProjectView = (props: project) => {
  const { id, name, description } = props;
  return (
    <div key={id} className="p-8 border-b border-slate-400">
      <div className="flex flex-col">
        <div className="flex">
          <span><h3 className="text-center font-sans text-2xl tracking-tight">{name}</h3></span>
        </div>
        <span><p>{description}</p></span>
      </div>
    </div>
  )
};

export default function Home() {
  const { isSignedIn } = useUser();
  const allProjects = api.project.getAll.useQuery(void {}).data;

  return (
    <div>
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

      <h2 className="text-center font-sans text-3xl tracking-tight py-10">Our current projects</h2>
      <div className="flex flex-col">
        {allProjects?.map((project) => (<ProjectView {...project} key={project.id} />
        ))}
      </div>
    </div>
  );
}
