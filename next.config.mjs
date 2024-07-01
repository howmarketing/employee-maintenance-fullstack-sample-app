/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: ['http://localhost:8080', 'localhost:3000', 'localhost:8080', 'localhost:3001', 'https://nextjs.org', 'nextjs.org', '*.nextjs.org'],
		},
	},
	logging: {
		fetches: { fullUrl: true }
	},
	env: {
		BASE_URL: process.env.BASE_URL
	}
};

export default nextConfig;

