import { z } from "zod";
import type { Seat } from "~/validations/admin/seat.validation";
import type { Trip } from "~/validations/admin/trip.validation";
import type { TripStop } from "~/validations/admin/trip_stop.validation";

export enum BookingStatus {
  PENDING = "PENDING", // Giữ chỗ tạm (chưa thanh toán)
  CONFIRMED = "CONFIRMED", // Đã thanh toán / xác nhận vé
  CANCELLED = "CANCELLED", // Khách hủy (trước giờ chạy)
  EXPIRED = "EXPIRED", // Hết thời gian giữ chỗ
  CHECKED_IN = "CHECKED_IN", // Đã lên xe
  NO_SHOW = "NO_SHOW", // Không lên xe
  COMPLETED = "COMPLETED", // Chuyến kết thúc
  REFUNDED = "REFUNDED", // Đã hoàn tiền
}

export enum PaymentMethod {
  CASH = "CASH", // Tiền mặt (quầy)
  BANK_TRANSFER = "BANK_TRANSFER",
  E_WALLET = "E_WALLET", // Momo, ZaloPay
  CREDIT_CARD = "CREDIT_CARD",
  COD = "COD", // Thu tiền khi lên xe
}

export enum PaymentStatus {
  UNPAID = "UNPAID", // Chưa thanh toán
  PENDING = "PENDING", // Đang xử lý (redirect cổng)
  PAID = "PAID", // Thanh toán thành công
  FAILED = "FAILED", // Thanh toán lỗi
  REFUNDING = "REFUNDING", // Đang hoàn tiền
  REFUNDED = "REFUNDED", // Đã hoàn tiền
}

export const CreateBookingSchema = z.object({
  tripId: z.string(),
  seatIds: z.array(z.string()),
  fromStopId: z.string(),
  toStopId: z.string(),
  status: z.string(),
  departureTime: z.number(),
  amount: z.number(),
  paymentInfo: z.object({
    method: z.string(),
    status: z.string(),
    amount: z.number(),
    paidAmount: z.number().optional(),
    transactionId: z.string().optional(),
    provider: z.string().optional(),
    paidAt: z.number().optional(),
    refundAmount: z.number().optional(),
    refundedAt: z.number().optional(),
    note: z.string().optional(),
    image: z.string().optional(),
  }),
  customerInfo: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    note: z.string().optional(),
  }),
});

export type CreateBooking = z.infer<typeof CreateBookingSchema>;

export const UpdateBookingSchema = CreateBookingSchema.partial();
export type UpdateBooking = z.infer<typeof UpdateBookingSchema>;

export type PaymentInfo = {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  paidAmount?: number;
  transactionId?: string;
  provider?: string;
  paidAt?: number;
  refundAmount?: number;
  refundedAt?: number;
  note?: string;
  image?: string;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  note?: string;
};

export type Booking = {
  _id: string;
  tripId: Trip;
  seatIds: Seat[];
  fromStopId: TripStop;
  toStopId: TripStop;
  status: BookingStatus;
  departureTime: number;
  amount: number;
  paymentInfo: PaymentInfo;
  customerInfo: CustomerInfo;
  expireAt: number;
  createdAt: string;
  updatedAt: string;
};
