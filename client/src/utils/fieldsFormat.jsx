export const projectFields = [
  {
    name: "name",
    label: "Project Name",
    type: "text",
    required: true,
    placeholder: "e.g., Aerodynamics Simulation",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
    placeholder: "Describe the goals, links, or notes for this project...",
  },
];

export const taskFields = [
  {
    name: "title",
    label: "Task Title",
    type: "text",
    required: true,
    placeholder: "e.g. Design front wing",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Describe the task...",
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    required: true,
    options: [
      {
        label: "Low",
        value: "Low",
      },
      {
        label: "Medium",
        value: "Medium",
      },
      {
        label: "High",
        value: "High",
      },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      {
        label: "To Do",
        value: "To Do",
      },
      {
        label: "In Progress",
        value: "In Progress",
      },
      {
        label: "Done",
        value: "Done",
      },
    ],
  },
];


export const profileFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    placeholder: "Enter your first name",
  },
  {
    name: "secondName",
    label: "Second Name",
    type: "text",
    required: true,
    placeholder: "Enter your second name",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    required: true,
    placeholder: "Enter your username",
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    required: true,
    placeholder: "Enter your email",
  },
];