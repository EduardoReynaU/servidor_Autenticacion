/**
 * @param {UserRepositoryPort} userRepo
 */
export const getUserById = (userRepo) => async (id) => {
    return await userRepo.findById(id);
  };

  