const nextConfig = { 
    images: { 
      remotePatterns: [
        { 
          protocol: 'https',
          hostname: 'c.pxhere.com',
          pathname: '/photos/**',
        },
        { 
          protocol: 'https',
          hostname: 'cdn.pixabay.com',
          pathname: '/photo/**', 
        },
        {
          protocol: 'https',
          hostname: '*.public.blob.vercel-storage.com',
          pathname: '/**',
        },
      ]
    }
  }
  
  export default nextConfig;