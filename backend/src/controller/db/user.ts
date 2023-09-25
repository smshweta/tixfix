import { PoolConnection } from "mysql2";
import { connection } from "../../config/db";
import { User } from "../../model/user";

const insertUser = (user: User): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
            const query = `INSERT INTO user(firstname, username, lastname, hashed_password, email, role) VALUES ('${user.firstname}', '${user.username}', '${user.lastname}', '${user.hashed_password}', '${user.email}', '${user.role}')`
            conn.query(query, (err: unknown) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(true);
            });
        });
    });
}

const selectUserByUsername = (username: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
            conn.query(`select * from user where username = '${username}'`, (err: unknown, resultSet: User[]) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                if (resultSet.length === 0) {
                  return reject('User not found');
                }
                return resolve(resultSet[0]);
            });
        });
    });
}

const selectUserById = (id: number): Promise<User> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
            conn.query(`select * from user where id = '${id}'`, (err: unknown, resultSet: User[]) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(resultSet[0]);
            });
        });
    });
}

const selectAllEmployees = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
            conn.query(`select * from user where role = 'employee'`, (err: unknown, resultSet: User[]) => {
                conn.release();
                if (err) {
                    return reject(err);
                }
                return resolve(resultSet);
            });
        });
    });
}

export default { insertUser, selectUserByUsername, selectUserById, selectAllEmployees };