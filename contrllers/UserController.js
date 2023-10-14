import jwt from "jsonwebtoken";
import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import ENV from "../config.js";

export const verifyUser = async (req, res, next) => {
  try {
    const { email } = req.method === "GET" ? req.query : req.body;

    let existEmail = await UserModel.findOne({ email });

    if (!existEmail) {
      return res.status(404).send({ error: "Email not Found" });
    }
    next();
  } catch (error) {
    return res.status(500).send({ error: "Authentication Error" });
  }
};

export const register = (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  try {
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email })
        .then((email) => {
          if (email) reject({ error: "Please use unique email" });

          resolve();
        })
        .catch((err) => {
          if (err) reject(new Error(err));
        });
    });

    Promise.all([existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                password: hashedPassword,
                email,
                firstname,
                lastname,
              });

              user
                .save()
                .then((data) => {
                  res.status(201).send({ data, status: 201 });
                })
                .catch((error) => {
                  return res.status(500).send({ error });
                });
            })
            .catch((error) => {
              // console.log(error);
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const login = (req, res) => {
  const { email, password } = req.body;

  try {
    UserModel.findOne({ email })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(404).send({ error: "Don't have Password" });
            }

            jwt.sign(
              { userId: user._id, email: user.email },
              ENV.JWT_SECRET,
              (err, token) => {
                if (err) {
                  return res.status(500).send({ error: "JWT Error" });
                }

                return res.status(200).send({
                  msg: "Login Sucessfully",
                  email: user.email,
                  token,
                });
              }
            );
          })
          .catch((err) => {
            return res.status(404).send({ error: "Password dose not Match" });
          });
      })
      .catch((err) => {
        return res.status(404).send({ error: "Email not Found" });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getUser = (req, res) => {
  const { email } = req.params;

  try {
    if (!email) {
      res.status(501).send({ error: "Invalid Email" });
    }

    UserModel.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(500).send({ error: "Couldn't Find the User" });
        }

        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(201).send(rest);
      })
      .catch((err) => {
        return res.status(500).send({ err });
      });
  } catch (error) {
    return res.status(404).send({ error: "Email not Found" });
  }
};

export const updateUser = (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(501).send({ error: "User not Found" });
    } else {
      const body = req.body;
      // console.log(req.file);
      let user;
      if (!req.file?.filename) {
        user = {
          email: body.email,
          firstname: body.firstname,
          lastname: body.lastname,
          profilePicture: body.profilePictureUrl,
        };
      } else {
        user = {
          email: body.email,
          firstname: body.firstname,
          lastname: body.lastname,
          profilePicture:
            req.protocol +
            "://" +
            req.get("host") +
            "/uploads/" +
            req.file.filename,
        };
      }

      UserModel.updateOne({ _id: username }, user)
        .then((result) => {
          if (!result) {
            return res.status(500).send({ error: "User not Found" });
          }
          return res.status(201).send({ msg: "User Update Sucessfully" });
        })
        .catch((err) => {
          return res.status(500).send({ err });
        });
    }
  } catch (error) {
    res.status(501).send({ error });
  }
};
