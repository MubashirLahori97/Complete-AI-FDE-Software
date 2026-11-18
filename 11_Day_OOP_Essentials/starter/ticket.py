from dataclasses import dataclass

@dataclass
class Ticket:
    ticket_id: str
    title: str
    status: str = "open"

    def close(self):
        if self.status != "open":
            raise ValueError("Only an open ticket can be closed")
        self.status = "closed"

ticket = Ticket("T001", "Order question")
print(ticket.ticket_id, ticket.status)
ticket.close()
print(ticket.ticket_id, ticket.status)
