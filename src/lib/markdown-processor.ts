import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

export const remarkPlugins: [typeof remarkGfm] = [remarkGfm]
export const rehypePlugins: [typeof rehypeHighlight, typeof rehypeSlug] = [rehypeHighlight, rehypeSlug]
