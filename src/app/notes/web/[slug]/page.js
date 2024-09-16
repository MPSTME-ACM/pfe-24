import client from "@/lib/client";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/imageUrl"; // Import the urlFor helper function

export async function generateStaticParams() {
  // Fetch all slugs for the pages
  const docs = await client.fetch(groq`*[_type == "web"]{ slug }`);
  
  // Return the slugs as params
  return docs.map((doc) => ({ slug: doc.slug.current }));
}

export default async function WebNotes({ params }) {
  const { slug } = params; // Extract the slug from params
  
  // Fetch the specific document by its slug
  const doc = await client.fetch(
    groq`*[_type == "web" && slug.current == $slug][0]{
      title,
      _id,
      slug,
      description,
      body
    }`,
    { slug }
  );

  // Handle case where no document is found
  if (!doc) {
    return <div>Content not found</div>;
  }

  return (
    <div>
      <h1>{doc.title}</h1>
      <p>{doc.description}</p>
      <PortableText value={doc.body} components={{
        types: {
          image: ({ value }) => (
            <figure>
              <img
                src={urlFor(value.asset).width(800).url()} 
                alt={value.caption || 'Image'}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              {value.caption && <figcaption>Diag: {value.caption}</figcaption>}
            </figure>
          )
        }
      }} />
    </div>
  );
}
