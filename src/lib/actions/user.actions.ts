import prisma from "../prisma";

export async function createUser(user: {
  id: number;
  email: string;
  username: string | null;
  image_url: string | null;
  password: string;
}) {
  try {
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.username,
        password: user.password,
      },
    });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function updateUser(
  id: number,
  user: {
    name: string | null;
    image_url: string | null;
  }
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: user.name,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

export async function deleteUser(id: number) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  }
}
