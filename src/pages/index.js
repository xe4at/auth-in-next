import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <button>
          <Link href="/singup">Singup</Link>
        </button>
        <button>
          <Link href="/singin">Singin</Link>
        </button>
      </div>
    </>
  );
}
