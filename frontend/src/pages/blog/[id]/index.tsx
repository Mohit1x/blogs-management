import { HeadHelper } from "@/components/HeadHelper";
import axios from "axios";
type User = {
    _id: string,
    username: string,
    followers: any[],
    profileImage: string;
}

type Blog = {
    id: string;
    title: string;
    tags:string[];
    content: string;
    userId:User;
    createdAt: string;
    image: string;
  };
  
  type Props = {
    blog: Blog;
  };

export async function getServerSideProps(context:any) {
    const {id} = context.query;
    if(id !== undefined){
        const res = await axios.get(`http://localhost:5000/api/blogs/blog/${id}`);
        const blog = res.data.blog;
        return { props: { blog: blog || [] } };
    }
  }

const Blog = ({blog}:Props)=>{

    return(
      <>
       <HeadHelper title={`A9Blogs - blog - ${blog.title}`} desc="home page of a9blogs" keywords={JSON.parse(blog.tags.join(","))}/>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-[56px] font-black leading-[66px] tracking-tight text-[#242424] break-words">{blog.title}</h1>
          <div className="flex justify-between items-center space-x-2 my-8">
            <div className="flex justify-start items-center space-x-4">
              <img className="h-16 w-16 rounded-full object-cover object-center" src={`http://localhost:5000/uploads/${blog.userId.profileImage}`} alt="profile image"/>
              <div className="flex flex-col items-start justify-start -space-y-1">
                <span className="text-2xl font-medium flex items-center gap-x-4">{blog.userId.username}</span>
                <span className="text-base font-medium text-gray-600">{blog.userId.followers?.length || 0} followers</span>
              </div>
            </div>
            <span className="text-lg font-medium self-end text-gray-800">{blog.createdAt}</span>
          </div>

         <hr className="border"/>

           <div className="flex justify-center items-center w-full">
          <img className="aspect-[3/2] w-full object-cover bg-gray-50 my-10 rounded-md" src={`http://localhost:5000/uploads/${blog.image}`} alt="Blog Image" />
          </div>
          <div className="tiptap-editor max-w-5xl break-words" dangerouslySetInnerHTML={{__html:blog.content}}/>
        </div>
      </>
    )
}

export default Blog