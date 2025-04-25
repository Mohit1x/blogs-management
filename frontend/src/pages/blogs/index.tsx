import { HeadHelper } from "@/components/HeadHelper";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";

const removeHtmlTags = (html: string) => html.replace(/<[^>]+>/g, "");

type Blog = {
  _id: string;
  title: string;
  tags:string[];
  content: string;
  authorId: string;
  author: string;
  authorImage: string;
  authorFollowers: number;
  createdAt: string;
  imageUrl: string;
};

type Props = {
  blogs: Blog[];
};


export async function getServerSideProps() {
  const res = await axios.get("http://localhost:5000/api/blogs/");
  const blogs = res.data.blogs;
  return { props: { blogs: blogs || [] } };
}


const BlogComponent = ({ blogs }: Props) => {
  const router = useRouter();

  return (
 <>
    <HeadHelper title="A9Blos - blogs" desc="blogs page of a9blogs"/>
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex flex-col space-y-4">
        {blogs.map((blog:Blog) => (
          <div
            key={blog._id}
            className="grid grid-cols-12 gap-2 items-start border-b py-6"
          >
            <div className="col-span-8">
              <div
                onClick={() => router.push(`/profile/${blog.authorId}`)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-start space-x-3 mb-3">
                  <img
                    src={blog.authorImage}
                    alt="author profile"
                    className="h-10 w-10 object-cover rounded-xs aspect-square border"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-xl -mb-1">{blog.author}</h1>
                    <p>{blog.authorFollowers} Followers</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between max-h-48 mt-2 cursor-pointer"  onClick={()=>{
                  const id = blog?._id;
                  router.push(`/blog/${id}`);
                }}>
                <h1 className="text-3xl font-semibold mb-2 line-clamp-2">
                  {blog.title}
                </h1>
                {blog.content && (
                  <span className="line-clamp-2 text-base font-medium leading-7 text-[#242424] opacity-[0.6] text-[17px] mb-2">
                    {removeHtmlTags(blog.content)}
                  </span>
                )}
                <span className="text-[15px] font-medium">
                  <span className="mr-1 text-[#242424] opacity-[0.6]">
                    Published on{" "}
                  </span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="col-span-4 p-10">
              <a
                onClick={()=>{
                  const id = blog?._id;
                  router.push(`/blog/${id}`);
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={blog.imageUrl}
                  alt="Blog"
                  className="aspect-[3/2] object-cover rounded-xs bg-gray-50"
                />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
 </>
  );
};

export default BlogComponent;
