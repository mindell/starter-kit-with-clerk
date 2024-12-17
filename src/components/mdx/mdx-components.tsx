'use client'

const components = {
  h1: (props: any) => (
    <h1 className="text-4xl font-bold mb-4" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-3xl font-bold mb-3" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-bold mb-2" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-4" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-4" {...props} />
  ),
  li: (props: any) => (
    <li className="mb-1" {...props} />
  ),
  a: (props: any) => (
    <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4" {...props} />
  ),
}

export default components
