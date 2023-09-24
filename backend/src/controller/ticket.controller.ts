import { Request, Response } from 'express';
import ticket from '../controller/db/ticket';
import { Status, Ticket } from '../model/ticket';
import user from './db/user';
import { Role } from '../model/user';

const getAllTickets = (req: Request, res: Response) => {
    ticket.selectAllTickets().then(tickets => { // .then for async call
        res.status(200).send({
            message: 'OK',
            result: tickets
        })
    }).catch((err: { code: unknown; }) => {
        console.log(err);
        res.status(500).send({
            message: 'DATABASE ERROR',
            error: err.code
        })
    })
}
const createTicket = (req: Request, res: Response) => {
    const { name, description, userid } = req.body;
    if (!name || !description) {
        return res.status(400).send({
            message: 'Name, description are required'
        })
    }
    const t: Ticket = {
        name: name,
        description: description,
        status: Status.OPEN,
        customer_id: userid,
    }
    ticket.insertTicket(t).then((result: Ticket | unknown) => {
        res.status(200).send({
            message: 'OK',
            result: result
        })
    }).catch((err: { code: unknown; }) => {
        console.log(err);
        res.status(500).send({
            message: 'Error while creating ticket',
            error: err.code
        })
    })
}

const getTicketById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    ticket.selectTicketById(id).then((result: Ticket) => {
        res.status(200).send({
            message: 'OK',
            result: result
        })
    }).catch((err: { code: unknown; }) => {
        console.log(err);
        res.status(500).send({
            message: 'Error while getting ticket',
            error: err.code
        })
    })
};

const updateTicketAssignedTo = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { assigned_id, userid } = req.body;
    user.selectUserById(userid).then((user) => {
        if (user.role !== Role.ADMIN) {
            return res.status(400).send({
                message: 'Only admin can update ticket'
            })
        }
    }).catch((err: { code: unknown; }) => {
        console.log(err);
        res.status(500).send({
            message: 'Error while updating ticket',
            error: err.code
        })
    });
    user.selectUserById(assigned_id).then((assigned_user) => {
        if (!assigned_id || assigned_user.role !== Role.EMPLOYEE) {
            return res.status(400).send({
                message: 'Assigned to is required'
            })
        }
    }).catch((err: { code: unknown; }) => {
        console.log(err);
        res.status(500).send({
            message: 'Error while updating ticket',
            error: err.code
        })
    });

    ticket.updateTicketAssignedTo(id, assigned_id).then((result: Ticket) => {
        res.status(200).send({
            message: 'OK',
            result: result
        })
    }).catch((err: { code: unknown; }) => {
        console.log(err);
        res.status(500).send({
            message: 'Error while updating ticket',
            error: err.code
        })
    })
};

const updateTicketStatus = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { status, userid } = req.body;
    user.selectUserById(userid).then((user) => {
        if (user.role !== Role.EMPLOYEE) {
            return res.status(400).send({
                message: 'Only admin can update ticket'
            })
        }
    }).catch((err: { code: unknown; }) => {
        console.log(err);
        res.status(500).send({
            message: 'Error while updating ticket',
            error: err.code
        })
    });
    if (!status || (status !== Status.OPEN && status !== Status.IN_PROGRESS && status !== Status.CLOSED)) {
        return res.status(400).send({
            message: 'Status is required and must be open, in progress or closed'
        })
    }
    ticket.updateTicketStatus(id, status).then((result: Ticket) => {
        res.status(200).send({
            message: 'OK',
            result: result
        })
        sendEmail(result);
    }).catch((err: { code: unknown; }) => {
        console.log(err);
        res.status(500).send({
            message: 'Error while updating ticket',
            error: err.code
        })
    })
};

const sendEmail = (ticket: Ticket) => {
    user.selectUserById(ticket.customer_id).then((customer) => {
        console.log('Sending email to customer at ' + customer.email);
    }).catch(() => {
        console.error('Error while sending email to customer');
    })
};
export default { getAllTickets, createTicket, getTicketById, updateTicketAssignedTo, updateTicketStatus };