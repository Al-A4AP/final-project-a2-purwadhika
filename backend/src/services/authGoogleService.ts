import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { Prisma, Role } from "@prisma/client";
import { env } from "../config/env";
import prisma from "../config/prisma";
import { AppError } from "../middlewares/errorHandler";
import type { AuthJwtPayload } from "../types/authJwt";
import { getGoogleProfile } from "./googleAuthService";

type GoogleProfile = {
  email?: string;
  name?: string;
  picture?: string;
};

type GoogleAuthUser = Prisma.UserGetPayload<{}>;

type SanitizedGoogleAuthUser = Omit<GoogleAuthUser, "password_hash">;
type AuthTokenPayload = Pick<AuthJwtPayload, "email" | "id" | "role">;

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES = env.JWT_EXPIRES_IN;
const JWT_SIGN_OPTIONS = { expiresIn: JWT_EXPIRES as SignOptions["expiresIn"] };

const generateToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, JWT_SECRET, JWT_SIGN_OPTIONS);

const sanitizeUser = (user: GoogleAuthUser): SanitizedGoogleAuthUser => {
  const { password_hash, ...safe } = user;
  return safe as SanitizedGoogleAuthUser;
};

const createGoogleUser = async (profile: GoogleProfile, role: Role) => {
  const dummyPassword = crypto.randomBytes(16).toString("hex");
  const password_hash = await bcryptjs.hash(dummyPassword, 10);
  return prisma.user.create({
    data: {
      email: profile.email!,
      name: profile.name || profile.email!,
      password_hash,
      role,
      auth_provider: "GOOGLE",
      verified_at: new Date(),
      avatar_url: profile.picture,
    },
  });
};

const verifyExistingGoogleUser = async (
  user: GoogleAuthUser,
  requestedRole?: Role,
) => {
  if (requestedRole && user.role !== requestedRole) {
    const roleName = user.role === 'TENANT' ? 'Tenant' : 'User';
    const targetRoleName = requestedRole === 'TENANT' ? 'Tenant' : 'User';
    throw new AppError(`Akun ini sudah terdaftar sebagai ${roleName}. Silakan login sebagai ${roleName} atau gunakan email lain untuk mendaftar sebagai ${targetRoleName}.`, 409);
  }
  if (user.verified_at) return user;
  return prisma.user.update({
    where: { id: user.id },
    data: { verified_at: new Date() },
  });
};

const findGoogleUser = (email: string) =>
  prisma.user.findFirst({ where: { email, deleted_at: null } });

const resolveGoogleUser = async (profile: GoogleProfile, role?: Role, mode?: "login" | "register") => {
  const existing = await findGoogleUser(profile.email!);
  if (existing) {
    return verifyExistingGoogleUser(existing, role);
  }
  if (mode === "login") {
    throw new AppError("Akun Google belum terdaftar. Silakan melakukan registrasi terlebih dahulu.", 404);
  }
  return createGoogleUser(profile, role || "USER");
};

const createGoogleAuthResult = (user: GoogleAuthUser) => ({
  user: sanitizeUser(user),
  token: generateToken({ id: user.id, email: user.email, role: user.role }),
});

export const googleLogin = async (data: {
  accessToken: string;
  role?: Role;
  mode?: "login" | "register";
}) => {
  const profile = await getGoogleProfile(data.accessToken);
  const user = await resolveGoogleUser(profile, data.role, data.mode);
  return createGoogleAuthResult(user);
};
