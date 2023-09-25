import { PoolConnection } from "mysql2";
import { connection } from "../../config/db";
import { Ticket } from "../../model/ticket";

const selectAllTickets = (): Promise<Ticket[]> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
      conn.query("select ticket.*, c.username as customer_uname, a.username as assigned_uname from ticket inner join user c on ticket.customer_id=c.id left join user a on ticket.assigned_id = a.id", (err: unknown, resultSet: Ticket[]) => {
        conn.release();
        if (err) {
          return reject(err);
        }
        return resolve(resultSet);
      });
    });
  });
}

const insertTicket = (ticket: Ticket): Promise<Ticket | unknown> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
      const query = `INSERT INTO ticket(name, description, status, customer_id) VALUES ('${ticket.name}', '${ticket.description}', '${ticket.status}', '${ticket.customer_id}')`
      conn.query(query, (err: unknown) => {
        conn.release();
        if (err) {
          return reject(err);
        }
        return selectTicketByCustomerIdAndName(ticket.customer_id, ticket.name).then((result: Ticket) => {
          return resolve(result);
        }).catch((err: unknown) => {
          return reject(err);
        });
      });
    });
  });

}

const selectTicketById = (id: number): Promise<Ticket> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
      conn.query(`select * from ticket where id = '${id}'`, (err: unknown, resultSet: Ticket[]) => {
        conn.release();
        if (err) {
          return reject(err);
        }
        return resolve(resultSet[0]);
      });
    });
  });
}

const selectTicketByCustomerIdAndName = (customer_id: number, name: string): Promise<Ticket> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
      conn.query(`select * from ticket where customer_id = '${customer_id}' and name = '${name}'`, (err: unknown, resultSet: Ticket[]) => {
        conn.release();
        if (err) {
          return reject(err);
        }
        return resolve(resultSet[0]);
      });
    });
  });
}

const updateTicketAssignedTo = (id: number, assigned_uname: string): Promise<Ticket> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
      conn.query(`update ticket set assigned_id = (select id from user where username='${assigned_uname}') where id = '${id}'`, (err: unknown) => {
        conn.release();
        if (err) {
          return reject(err);
        }
        return selectTicketById(id).then((result: Ticket) => {
          return resolve(result);
        }).catch((err: unknown) => {
          return reject(err);
        });
      });
    });
  });
};

const updateTicketStatus = (id: number, status: string): Promise<Ticket> => {
  return new Promise((resolve, reject) => {
    connection.getConnection((err: NodeJS.ErrnoException | null, conn: PoolConnection) => {
      conn.query(`update ticket set status = '${status}' where id = '${id}'`, (err: unknown) => {
        conn.release();
        if (err) {
          return reject(err);
        }
        return selectTicketById(id).then((result: Ticket) => {
          return resolve(result);
        }).catch((err: unknown) => {
          return reject(err);
        });
      });
    });
  });
};

export default { selectAllTickets, insertTicket, selectTicketById, updateTicketAssignedTo, updateTicketStatus };