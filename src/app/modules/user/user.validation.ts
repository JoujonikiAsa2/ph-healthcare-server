import z from "zod";
import { Gender, UserStatus } from "../../../../generated/prisma";

const adminSchemaValidation = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  admin: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string({
      required_error: "Contact nnumber is required",
    }),
    profilePhoto: z.string().optional(),
  }),
});

const doctorSchemaValidation = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  doctor: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string({
      required_error: "Contact nnumber is required",
    }),
    profilePhoto: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "Registration number is required",
    }),
    experience: z.number().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appoinmentFee: z.number({
      required_error: "Appoinment fee is required",
    }),
    qualification: z.string({
      required_error: "Qualification is required",
    }),
    currentWorkingPlace: z.string({
      required_error: "Current working place is required",
    }),
    designaton: z.string({
      required_error: "Designation is required",
    }),
  }),
});

const patientSchemaValidation = z.object({
  password: z.string({
    required_error: "Password is required",
  }),
  patient: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNumber: z.string({
      required_error: "Contact nnumber is required",
    }),
    profilePhoto: z.string().optional(),
    address: z.string().optional(),
  }),
});

const statusSchemaValidation = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
  }),
});


export const UserValidation = {
  adminSchemaValidation,
  doctorSchemaValidation,
  patientSchemaValidation,
  statusSchemaValidation,
};
