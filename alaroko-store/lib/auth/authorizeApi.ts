import type { NextApiRequest, NextApiResponse } from 'next';
import type { UserRole } from '@/types/UserRole';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../pages/api/auth/[...nextauth]"

export async function authorize(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles: UserRole[]
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).end();
  }

  if (!allowedRoles.includes(session.user.role)) {
    return res.status(403).end();
  }

  return session.user;
}