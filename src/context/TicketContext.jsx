import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const TicketContext = createContext(null);

export const TicketProvider = ({
  children,
}) => {
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem("bugs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "bugs",
      JSON.stringify(tickets)
    );
  }, [tickets]);

  // Create Ticket
  const createTicket = (ticketData) => {
    const newTicket = {
      id: ticketData.id || `BUG-${Date.now()}`,
      status: "Open",
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...ticketData,
    };

    setTickets((prev) => [
      newTicket,
      ...prev,
    ]);

    return newTicket;
  };

  // Update Ticket
  const updateTicket = (
    id,
    updates
  ) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? {
              ...ticket,
              ...updates,
              updatedAt:
                new Date().toISOString(),
            }
          : ticket
      )
    );
  };

  // Delete Ticket
  const deleteTicket = (id) => {
    setTickets((prev) =>
      prev.filter(
        (ticket) => ticket.id !== id
      )
    );
  };

  // Assign Developer
  const assignTicket = (
    id,
    developerId,
    developerName
  ) => {
    updateTicket(id, {
      assignedDeveloperId:
        developerId,
      assignedDeveloperName:
        developerName,
      status: "Assigned",
    });
  };

  // Change Status
  const changeStatus = (
    id,
    status
  ) => {
    updateTicket(id, { status });
  };

  // Add Comment
  const addComment = (
    ticketId,
    comment
  ) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              comments: [
                ...(ticket.comments ||
                  []),
                {
                  id: Date.now(),
                  ...comment,
                  createdAt:
                    new Date().toISOString(),
                },
              ],
              updatedAt:
                new Date().toISOString(),
            }
          : ticket
      )
    );
  };

  // Get One Ticket
  const getTicket = (id) => {
    return tickets.find(
      (ticket) => ticket.id === id
    );
  };

  // Dashboard Helpers
  const openTickets =
    tickets.filter(
      (t) => t.status === "Open"
    ).length;

  const assignedTickets =
    tickets.filter(
      (t) => t.status === "Assigned"
    ).length;

  const resolvedTickets =
    tickets.filter(
      (t) => t.status === "Resolved"
    ).length;

  const closedTickets =
    tickets.filter(
      (t) => t.status === "Closed"
    ).length;

  return (
    <TicketContext.Provider
      value={{
        tickets,

        createTicket,
        updateTicket,
        deleteTicket,

        assignTicket,
        changeStatus,
        addComment,

        getTicket,

        openTickets,
        assignedTickets,
        resolvedTickets,
        closedTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context =
    useContext(TicketContext);

  if (!context) {
    throw new Error(
      "useTickets must be used inside TicketProvider"
    );
  }

  return context;
};

export default TicketContext;