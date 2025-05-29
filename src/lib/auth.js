import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function createToken(payload) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
  } catch (error) {
    throw new Error('Error creating token');
  }
}

export function getAdminFromHeaders(headers) {
  const adminId = headers.get('x-admin-id');
  const adminRole = headers.get('x-admin-role');

  if (!adminId || adminRole !== 'admin') {
    throw new Error('Unauthorized');
  }

  return {
    id: adminId,
    role: adminRole
  };
}