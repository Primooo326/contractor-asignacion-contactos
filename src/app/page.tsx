"use client"
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  router.push("/auth");

  return (
    <div></div>
  );
}
