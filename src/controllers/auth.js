const { generateToken } = require("../../helpers/token");
const db = require("../../libs/database");
const { createUserValidation } = require("./user");
const bcrypt = require("bcrypt");

// Register
exports.register = async (req, res) => {
  const body = req.body;

  const validate = createUserValidation(body);

  if (validate.success === false) {
    return res.status(400).send(validate.error);
  }

  // Generate Salt = Algoritma
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(body.password, salt);

  const query = `INSERT INTO public."Users"(
                    name, email, password, role)
                    VALUES ('${body.name}', '${body.email}', '${hashedPassword}', '${body.role}') RETURNING *;`;

  const data = (await db.query(query)).rows[0];

  res.send(data);
};

// Login
exports.login = async (req, res) => {
  const body = req.body;

  const queryEmailCheck = `SELECT id, name, email, password, role
	FROM public."Users" WHERE email = '${body.email}';`;

  const emailCheck = await db.query(queryEmailCheck);

  if (emailCheck.rows.length === 0) {
    return res.status(400).send({ message: "email or password not match" });
  }

  const isMatch = await bcrypt.compare(
    body.password,
    emailCheck.rows[0].password
  );

  if (!isMatch) {
    return res.status(400).send({ message: "email or password not match" });
  }

  const user = emailCheck.rows[0];

  delete user.password;

  const token = generateToken(user);

  res.send({ user, token });
};

// Check user
