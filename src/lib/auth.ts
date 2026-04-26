import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.ts";
import { UserRole } from "../../generated/prisma/enums.ts";

//* Better-Auth Initialization
const auth = betterAuth({
	// App and Basic Settings
	appName: "FortePath",
	basePath: "/api/v1/auth",
	trustedOrigins: [process.env.APP_URL!],
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
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},
	},
	advanced: {
		cookiePrefix: "better-auth",
		useSecureCookies: process.env.NODE_ENV === "production",
		crossSubDomainCookies: {
			enabled: false,
		},
		disableCSRFCheck: true,
	},
});

export { auth };
