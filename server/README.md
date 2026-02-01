🌐 BASE URL ----> http://localhost:5000

🔐 AUTH API ---->
POST http://localhost:5000/api/auth/login
POST http://localhost:5000/api/auth/logout
GET http://localhost:5000/api/auth/refresh-token
GET http://localhost:5000/api/auth/protected

👤 USER API ---->
POST http://localhost:5000/api/users/process-register
POST http://localhost:5000/api/users/activate
POST http://localhost:5000/api/users/forget-password
PUT http://localhost:5000/api/users/reset-password
PUT http://localhost:5000/api/users/update-password/:id

GET http://localhost:5000/api/users
GET http://localhost:5000/api/users/:id
PUT http://localhost:5000/api/users/:id
PUT http://localhost:5000/api/users/manage-user/:id
DELETE http://localhost:5000/api/users/:id

🗂️ CATEGORY API ---->
POST http://localhost:5000/api/categories
GET http://localhost:5000/api/categories
GET http://localhost:5000/api/categories/:slug
PUT http://localhost:5000/api/categories/:slug
DELETE http://localhost:5000/api/categories/:slug

📦 PRODUCT API ---->
POST http://localhost:5000/api/products
GET http://localhost:5000/api/products
GET http://localhost:5000/api/products/:slug
PUT http://localhost:5000/api/products/:slug
DELETE http://localhost:5000/api/products/:slug

🌱 SEED API ---->
GET http://localhost:5000/api/seed/users
GET http://localhost:5000/api/seed/products



const deleteUserById = async (id, options = {}) => {
  try {
    const user = await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
    if (user && user.image) {
      await deleteImage(user.image);
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createErrors(400, "Invalid Id");
    }
    throw error;
  }
};