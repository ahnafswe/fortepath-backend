import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.ts";
import { UserRole } from "../../generated/prisma/enums.ts";
import { oAuthProxy } from "better-auth/plugins";

//* Better-Auth Initialization
const auth = betterAuth({
	// App and Basic Settings
	appName: "FortePath",
	basePath: "/api/v1/auth",
	trustedOrigins: [process.env.APP_URL!, "http://localhost:3000"],
	// Database Settings
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	// Auth Settings
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		minPasswordLength: 6,
	},
	// OAuth Providers
	socialProviders: {
		google: {
			enabled: true,
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			accessType: "offline",
			prompt: "select_account consent",
			responseMode: "form_post",
			scope: ["openid", "email", "profile"],
		},
	},
	user: {
		additionalFields: {
			role: { type: "string", defaultValue: UserRole.STUDENT },
		},
	},
	advanced: {
		cookies: {
			session_token: {
				name: "session_token",
				attributes: {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					partitioned: true,
				},
			},
			state: {
				name: "session_token",
				attributes: {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					partitioned: true,
				},
			},
		},
	},
	plugins: [oAuthProxy()],
});

export { auth };
