import { BUGS_DATA } from "../data/mock/bugsData";

export const getBugs = async () => {
  return BUGS_DATA;
};

export const getBugById = async (id) => {
  return BUGS_DATA.find(b => b.id === id) || null;
};

export const createBug = async (data) => {
  return { id: `BUG-${Date.now()}`, ...data };
};

export const updateBug = async (id, data) => {
  return { id, ...data };
};

export const getWorkflow = async () => {
  return [
    { title: "Open", bugs: ["Login issue"] },
    { title: "In Progress", bugs: ["Dashboard issue"] },
  ];
};
