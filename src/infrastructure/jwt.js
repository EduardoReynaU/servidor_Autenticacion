import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecreto123'; // Usa una variable de entorno en producción
const EXPIRES_IN = '1h'; // Puedes cambiar la duración del token a '1d', '7d', etc.

/**
 * Genera un JWT a partir de la información de usuario.
 * @param {Object} user - El objeto del usuario.
 * @returns {string} - Token JWT.
 */
export function generateJWT(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email
    // Puedes agregar más campos si es necesario
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
}

/**
 * Verifica y decodifica un JWT.
 * @param {string} token - El token JWT a verificar.
 * @returns {Object} - Payload decodificado (usuario).
 * @throws {Error} - Si el token no es válido o ha expirado.
 */
export function verifyJWT(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
} 
