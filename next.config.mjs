/** @type {import('next').NextConfig} */
const nextConfig = {
	logging: {
		fetches: {fullUrl: true}
	},
	env: {
		BASE_URL: process.env.BASE_URL
	}
};

export default nextConfig;
