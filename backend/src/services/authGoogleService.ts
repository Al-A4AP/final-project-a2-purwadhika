import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { Prisma, Role } from "@prisma/client";
import prisma from "../config/prisma";
import { AppError } from "../middlewares/errorHandler";
import { getGoogleProfile } from "./googleAuthService";

type GoogleProfile = {
  email?: string;
  name?: string;
  picture?: string;
};

type GoogleAuthUser = Prisma.UserGetPayload<{}>;

type SanitizedGoogleAuthUser = Omit<GoogleAuthUser, "password_hash">;

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";
const JWT_SIGN_OPTIONS = { expiresIn: JWT_EXPIRES as SignOptions["expiresIn"] };

const generateToken = (payload: object) =>
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
  if (requestedRole && user.role !== requestedRole)
    throw new AppError("Email Google sudah terdaftar dengan role berbeda", 409);
  if (user.verified_at) return user;
  return prisma.user.update({
    where: { id: user.id },
    data: { verified_at: new Date() },
  });
};

const findGoogleUser = (email: string) =>
  prisma.user.findFirst({ where: { email, deleted_at: null } });

const resolveGoogleUser = async (profile: GoogleProfile, role?: Role) => {
  const existing = await findGoogleUser(profile.email!);
  return existing
    ? verifyExistingGoogleUser(existing, role)
    : createGoogleUser(profile, role || "USER");
};

const createGoogleAuthResult = (user: GoogleAuthUser) => ({
  user: sanitizeUser(user),
  token: generateToken({ id: user.id, email: user.email, role: user.role }),
});

export const googleLogin = async (data: {
  accessToken: string;
  role?: Role;
}) => {
  const profile = await getGoogleProfile(data.accessToken);
  const user = await resolveGoogleUser(profile, data.role);
  return createGoogleAuthResult(user);
};
