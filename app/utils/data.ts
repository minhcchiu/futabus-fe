import { PaymentMethod } from "~/validations/admin/booking.validation";

export const METHODS_DATA = [
  {
    key: "VNPay",
    label: "Thanh toán VietQR",
    icon: "https://storage.googleapis.com/futa-busline-web-cms-prod/VNPAY_payment_f70a6c71dc/VNPAY_payment_f70a6c71dc.png",
    note: "Nhập VNPAYFUTA26 - Giảm 15K đơn từ 300K, giảm 30K đơn từ 750K",
  },
  {
    key: "ZaloPay",
    label: "ZaloPay",
    icon: "https://storage.googleapis.com/futa-busline-web-cms-prod/zalopay_fcfdae0580/zalopay_fcfdae0580.svg",
    note: "Giảm 25% tối đa 20k cho khách hàng lần đầu thanh toán; giảm 10k cho cho tất cả các giao dịch.",
  },
  {
    key: PaymentMethod.BANK_TRANSFER,
    label: "Mai Linh",
    icon: "https://storage.googleapis.com/futa-busline-web-cms-prod/futapay_db8da73dc3/futapay_db8da73dc3.svg",
    note: "Thanh toán qua Mai Linh",
  },
  {
    key: "MBBANK",
    label: "MB Bank",
    icon: "https://storage.googleapis.com/futa-busline-web-cms-prod/viet_QR_e6b170910a/viet_QR_e6b170910a.png",
    note: "QR chuyển khoản, quét mã thanh toán an toàn và tiện lợi.",
  },
];
