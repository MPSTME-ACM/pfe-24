import client from "@/lib/client";
import { groq } from "next-sanity";
import Link from 'next/link';

export default async function WebNotes() {
  // Fetch all documents with title and slug
  const docs = await client.fetch(
    groq`*[_type == "web"]{
      title,
      slug
    }`
  );

  // Handle case where no documents are found
  if (!docs || docs.length === 0) {
    return <div>No documents found.</div>;
  }

  // Function to extract chapter number for sorting
  const getChapterNumber = (title) => {
    const match = title.match(/CH\s-\s(\d+)/);
    return match ? parseInt(match[1], 10) : Infinity; // Assign Infinity to non-matching titles
  };

  // Sort documents by chapter number
  docs.sort((a, b) => getChapterNumber(a.title) - getChapterNumber(b.title));

  return (
    // <div className="prose lg:prose-xl">
    <div className="prose-xl w-full max-w-[1204px] mx-auto flex flex-col justify-center md:justify-start items-start  lg:bg-[url('/grainny.png')] bg-no-repeat bg-cover overflow-hidden text-white px-4 md:px-0 pb-10 gap-10">
      <br></br>
      <h1 className="scroll-m-20 text-4xl font-medium tracking-tight lg:text-6xl animate-fade-right animate-duration-700 ">
        Document <br className="md:hidden">
        </br>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9046D4] to-[#FFA7FB]">
          List !
        </span>
      </h1>
      <ul>
        {docs.map((doc) => (
          <li key={doc.slug.current} 
          className="block underline underline-offset-4 hover:decoration-pink-700 transition-all duration-300 ease-in-out">
            {/* Link to the dynamic route with the slug */}
            <Link href={`/notes/web/${doc.slug.current}`}>
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}