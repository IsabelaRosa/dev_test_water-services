import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Post } from './entity/Post';
import { validate } from 'class-validator';

const app = express();
app.use(express.json());

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "test_db",
  entities: [User,Post],
  synchronize: true,
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeDatabase = async () => {
  await wait(20000);
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization:", err);
    process.exit(1);
  }
};

initializeDatabase();

app.post('/users', async (req, res) => {
  const { firstName, lastName, email } = req.body;

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;

  try {
    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const savedUser = await AppDataSource.manager.save(user);
    return res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(500).send("Internal Server Error");
  }
});

app.post('/posts', async (req, res) => {
  const { title, description, userId } = req.body;

  const user = await AppDataSource.manager.findOneBy(User, { id: userId });
  if (user == null) {
    return res.status(404).send("Error creating post: User not found");
  }

  const post = new Post();
  post.title = title;
  post.description = description;
  post.userId = userId;

  try {
    const errors = await validate(post);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const savedPost = await AppDataSource.manager.save(post);
    return res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
