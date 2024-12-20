'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter()

  return (
    <Image onClick={() => { router.push('/') }} className="hidden md:block cursor-pointer" alt="Logo" height="150" width="150" src="/images/logo.jpg" />
  );
}

export default Logo; 