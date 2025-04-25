import Head from "next/head";

type HeadProps = {
  title: string;
  desc: string;
  keywords?: string;
};

export const HeadHelper = ({
  title = "A9Blogs-Home",
  desc = "create blogs with different styles",
  keywords = "blogs, A9 Blogs",
}: HeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};
