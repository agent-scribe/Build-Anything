import { redirect } from "next/navigation";

/** The product is the workspace. Land users straight in the generator. */
export default function Home() {
  redirect("/dashboard");
}
