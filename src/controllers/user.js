const db = require("../../libs/database");
const z = require("zod");

// Get all data
exports.findUser = async (req, res) => {
  // token = id card
  const token = true;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const query = `SELECT * FROM public."Users";`;

  const data = await db.query(query);

  res.send(data.rows);
};

// Get single data by id
exports.getUserById = async (req, res) => {
  const id = req.params.id;

  const query = `SELECT * FROM public."Users" WHERE id = '${id}';`;

  const data = await db.query(query);

  if (data.rows.length === 0) {
    return res.status(404).send({ message: "not found" });
  }

  res.send(data.rows[0]);
};

exports.createUserValidation = (data) => {
  const createUserSchema = z.object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    role: z.enum(["seller", "buyer"], {
      message: "Role must be either 'seller' or 'buyer'",
    }),
  });

  try {
    createUserSchema.parse(data);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return { success: false, error: formattedErrors };
    }

    return "Unknown error";
  }
};

// Post data
exports.createUser = async (req, res) => {
  const body = req.body;

  const validate = createUserValidation(body);

  if (validate.success === false) {
    return res.status(400).send(validate.error);
  }

  const query = `INSERT INTO public."Users"(
                  name, email, password, role)
                  VALUES ('${body.name}', '${body.email}', '${body.password}', '${body.role}') RETURNING *;`;

  const data = (await db.query(query)).rows[0];

  res.send(data);
};

// Update data
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const queryCheckUserById = `SELECT * FROM public."Users" WHERE id = ${id}`;
  const users = await db.query(queryCheckUserById);

  if (users.rows.length === 0) {
    return res.status(404).send({ message: "not found" });
  }

  const queryUpdate = `UPDATE public."Users"
                        SET name='${body.name}', email='${body.email}', password='${body.password}', role='${body.role}'
                        WHERE id=${id} RETURNING *;`;

  const data = await db.query(queryUpdate);

  res.send(data.rows[0]);
};

// Delete
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  const queryCheckUserById = `SELECT * FROM public."Users" WHERE id = ${id}`;
  const users = await db.query(queryCheckUserById);

  if (users.rows.length === 0) {
    return res.status(404).send({ message: "not found" });
  }

  const query = `DELETE FROM public."Users" WHERE id = ${id};`;

  await db.query(query);

  res.send({ message: "delete success" });
};
