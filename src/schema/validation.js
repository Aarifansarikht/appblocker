import { z } from 'zod';
import dayjs from 'dayjs';

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  // email: z
  //   .string()
  //   .email('Enter a valid email')
  //   .optional(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number starting with 6-9')
     .nonempty("Phone number is required"),

  // password: z
  //   .string()
  //   .min(8, 'Password must be at least 8 characters long')
  //   .nonempty('Password is required'),
  // fcmToken: z.string().optional(),
}).refine(data => data.email || data.phone, {
  message: 'phone number is required.',
  path: ['phone'],
});

export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        'Password must include a number, uppercase, lowercase, and special character.'
      )
      .nonempty('Password is required'),

    confirmPassword: z.string().nonempty('Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'], // This ensures the error is shown under confirmPassword field
  });
// export const signupSchema = z.object({
//   name: z.string().nonempty('Name is required'),
//   email: z.string().email('Invalid email format').nonempty('Email is required'),
//   password: z.string().min(6, 'Password must be at least 6 characters long').nonempty('Password is required'),
// });

export const signupSchema = z.object({
  name: z
    .string()
    .nonempty('Name is required')
    .max(50, 'Name must not exceed 50 characters'),

  email: z
    .string()
    .nonempty('Email is required')
    .email('Enter a valid email address')
    .optional(), // Email is optional, but only if phone is provided

  phone: z
    .string()
    .nonempty('Phone number is required')
    .regex(/^(\+91|91)?[6-9][0-9]{9}$/, 'Email or phone number is required')
    .optional(), // Phone is optional, but only if email is provided

  password: z
    .string()
    .nonempty('Password is required')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      'Password must include a number, uppercase, lowercase, and special character with a minimum length of 8 characters'
    ),
})
  .refine(data => data.email || data.phone, {
    message: 'Email or phone number is required',
    path: ['email', 'phone'],
  });

export const profileSchema = z.object({
  image: z.string().optional(),
  firstName: z.string().nonempty('firstName is required'),
  phone: z.string().nonempty('Phone number is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  // address: z.string().nonempty('Address is required'),
  // apartment: z.string().optional(),
  // pincode: z.string().nonempty('Pincode is required'),
  // state: z.string().nonempty('State is required'),
  // city: z.string().nonempty('City is required'),
});

export const finishSignUp = z.object({  
  firstName: z.string().nonempty('Name is required'),
  lastName: z.string().optional('Last name must be a string'),
  phone: z.string().nonempty('Phone number is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  birthDate: z.string().nonempty("Date of birth is required")
})



export const addressSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email format'),
  address: z.string().nonempty('Address is required'),
  address2: z.string().optional(),
  landmark: z.string().optional(),
  postalCode: z.string().nonempty('Postal Code is required'),
  state: z.string().nonempty('State is required'),
  city: z.string().nonempty('City is required'),
  country: z.string().nonempty('Country is required'),
  phone: z.string()
    .nonempty('Phone number is required')
    .regex(/^\+91\d{10}$/, 'Phone number must be 10 digits'),
  altPhone: z.string().optional(),
  locationType: z.string().nonempty('Location type is required'),
  // coordinates: z.object({
  //   latitude: z.number().nonnegative('Latitude is required'),
  //   longitude: z.number().nonnegative('Longitude is required'),
  // }).optional(),
});




export const creditCardSchema = z.object({
  holderName: z.string().nonempty('Cardholder name is required'),
  cardNumber: z.string()
    .nonempty('Card number is required')
    .regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryDate: z.string()
    .nonempty('Expiry date is required')
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiry date format (MM/YY)')
    .refine((date) => {
      const [month, year] = date.split('/').map(Number);
      if (!month || !year) return false;

      const expiry = dayjs().year(2000 + year).month(month - 1).endOf('month');
      return expiry.isAfter(dayjs());
    }, {
      message: 'Expiry date must be in the future',
    }),
  cvv: z.string()
    .nonempty('CVV is required')
    .regex(/^\d{3}$/, 'CVV must be 3 digits'),
});


export const upiSchema = z.object({
  upiId: z.string()
    .nonempty('UPI ID is required')
    .regex(/^[0-9A-Za-z.-]{2,256}@[A-Za-z]{2,64}$/, 'Invalid UPI ID format (e.g., example@bank)'),
});

