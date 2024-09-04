export const formRegex = {
  email: [
    {
      regex: /^[a-zA-Z0-9._%]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      errMsg: <span>Invalid Email Address</span>,
    },
    {
      regex: /.+/,
      errMsg: <span>Email is required</span>,
    },
  ],
  password: [{}, {}, {}, {}],
  givenName: [
    {
      regex: /^[a-zA-Z]+[a-zA-Z.]*$/,
      errMsg: <span>Invalid first name</span>,
    },
    {
      regex: /^[a-zA-Z.]*$/,
      errMsg: <span>First name may only contain letters and/or periods</span>,
    },
    {
      regex: /.+/,
      errMsg: <span>First name is required</span>,
    },
  ],
  middleInitial: [
    {
      regex: /^[a-zA-Z]{0,1}$/,
      errMsg: <span>Middle initial must be a letter</span>,
    },
  ],
  familyName: [
    {
      regex: /^[a-zA-Z]+[a-zA-Z.]*$/,
      errMsg: <span>Invalid last name</span>,
    },
    {
      regex: /^[a-zA-Z.]*$/,
      errMsg: <span>Last name may only contain letters and/or periods</span>,
    },
    {
      regex: /.+/,
      errMsg: <span>Last name is required</span>,
    },
  ],
  institution: [
    {
      regex: /^[a-zA-Z0-9 ,.]*$/,
      errMsg: (
        <span>
          Institution name may only contain letters, commas, spaces, and/or
          periods
        </span>
      ),
    },
  ],
};

export const initialPasswordRequirements = [
  { regex: /.{8,}/, requirement: "At least 8 characters", isMet: false },
  { regex: /[0-9]+/, requirement: "At least one number", isMet: false },
  {
    regex: /[\^$*.[\]{}()?\-"!@#%&/\\,><':;|_~`+=]+/,
    requirement: "At least one special character",
    isMet: false,
  },
  {
    regex: /[A-Z]+/,
    requirement: "At least one uppercase letter",
    isMet: false,
  },
  {
    regex: /[a-z]+/,
    requirement: "At least one lowercase letter",
    isMet: false,
  },
];