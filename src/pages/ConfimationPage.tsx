import type { JSX } from 'react';
import { useLocation, Link } from 'react-router'; // keep consistent with your project imports
import InfoSection from '../components/InfoSection';

/* --- Icons (kept from your snippet) --- */
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#9fe0a8] inline-block " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9aa79a] inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9aa79a] inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ReceiptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9aa79a] inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5a2 2 0 012 2h2a2 2 0 012-2" />
  </svg>
);

/* --- Types --- */
interface BikeInfo {
  make?: string;
  model?: string;
  serialNumber?: string;
  image?: string;
  price_per_day?: number;
}

interface UserInfo {
  name?: string;
  email?: string;
  contact?: string;
  firstName?: string;
  lastName?: string;
}

interface TransactionDetails {
  date?: string;
  referenceNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  duration?: number;
  totalAmount?: number;
}

/* --- Component --- */
export default function ConfirmationPage(): JSX.Element {
  const location = useLocation();

  // Prefer `location.state.booking` shape if present — otherwise attempt generic fields
  const state = (location.state || {}) as any;

  // attempt to normalize different possible shapes
  const booking = state?.booking ?? state; // if you passed booking directly or passed the fields themselves
  const bikeInfo: BikeInfo = booking?.bike ?? {
    make: booking?.bikeMake ?? booking?.make,
    model: booking?.bikeModel ?? booking?.model,
    serialNumber: booking?.bikeSerial ?? booking?.serialNumber,
    image: booking?.bike?.image ?? booking?.image,
    price_per_day: booking?.bike?.price_per_day ?? booking?.price_per_day,
  };

  const userInfo: UserInfo = booking?.user ?? {
    name: booking?.user?.name ?? `${booking?.firstName ?? ''} ${booking?.lastName ?? ''}`.trim(),
    email: booking?.user?.email ?? booking?.email,
    contact: booking?.user?.phone ?? booking?.contact,
    firstName: booking?.user?.firstName,
    lastName: booking?.user?.lastName,
  };

  const transactionDetails: TransactionDetails = booking?.transactionDetails ?? {
    date: booking?.createdAt ?? booking?.date,
    referenceNumber: booking?.id ?? booking?.referenceNumber,
    checkInDate: booking?.user?.checkInDate ?? booking?.checkInDate ?? booking?.transaction?.checkInDate,
    checkOutDate: booking?.user?.checkOutDate ?? booking?.checkOutDate ?? booking?.transaction?.checkOutDate,
    duration: booking?.user?.duration ?? booking?.duration ?? booking?.transaction?.duration ?? 1,
    totalAmount: booking?.totalAmount ?? booking?.transaction?.totalAmount,
  };

  const formatDate = (value?: string) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const total = transactionDetails.totalAmount ?? (bikeInfo.price_per_day && transactionDetails.duration ? bikeInfo.price_per_day * (transactionDetails.duration ?? 1) : undefined);

  // If nothing useful found, show fallback
  const hasAny = !!(bikeInfo.make || bikeInfo.model || userInfo.email || transactionDetails.referenceNumber || booking);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-linear-to-br from-[#0f1410] via-[#121512] to-[#0b0b0b] border border-[#232323] rounded-2xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="px-6 py-6 border-b border-[#1f1f1f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#e6efe6] flex items-center">
                <span className="inline-flex items-center justify-center mr-3 bg-[#0f2a20] rounded-full p-2 shadow-inner">
                  <CheckCircleIcon />
                </span>
                Booking Confirmed
              </h1>
              <p className="mt-1 text-sm text-[#bdbdbd]">Thanks — your bike rental is confirmed. A confirmation email has been sent.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-[#9aa79a]">Reference</div>
                <div className="font-mono font-semibold text-[#e6efe6]">{transactionDetails.referenceNumber ?? '—'}</div>
                <div className="text-xs text-[#9aa79a] mt-1">Booked on {formatDate(transactionDetails.date)}</div>
              </div>

              <button
                onClick={() => window.print()}
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#2d5a3d] hover:bg-[#3b7a53] text-white text-sm transition transform hover:-translate-y-0.5">
                Print
              </button>
            </div>
          </div>

          {/* Main body */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - bike summary */}
            <div className="lg:col-span-1 bg-[#0b0b0b] border border-[#1f1f1f] rounded-lg p-4 flex flex-col gap-4">
              <div className="w-full h-44 rounded-md overflow-hidden bg-[#080808] border border-[#171717]">
                <img
                  src={bikeInfo.image ?? 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                  alt={bikeInfo.model ?? bikeInfo.make ?? 'bike'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#e6efe6]">{(bikeInfo.make || '') + (bikeInfo.model ? ` — ${bikeInfo.model}` : '') || 'Bike'}</h3>
                <div className="text-sm text-[#bdbdbd] mt-1">
                  Serial: <span className="font-mono text-[#9fe0a8]">{bikeInfo.serialNumber ?? '—'}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#9aa79a]">Price / day</div>
                  <div className="text-lg font-semibold text-[#e6efe6]">{bikeInfo.price_per_day ? `$${bikeInfo.price_per_day}` : '—'}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-[#9aa79a]">Duration</div>
                  <div className="text-lg font-semibold text-[#e6efe6]">{transactionDetails.duration ?? 1} day(s)</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-[#9aa79a]">Total estimated</div>
                <div className="text-2xl font-bold text-[#9fe0a8]">{total ? `$${total.toFixed(2)}` : '—'}</div>
              </div>
            </div>

            {/* Right column - details */}
            <div className="lg:col-span-2 bg-[#070707] border border-[#151515] rounded-lg p-6 space-y-6 ">
              {/* Booking Period + User + Transaction grouped as InfoSections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <div>
                  <InfoSection
                    title="Booking Period"
                    icon={<CalendarIcon />}
                    items={[
                      { label: 'Check-in', value: formatDate(transactionDetails.checkInDate ?? '') },
                      { label: 'Check-out', value: formatDate(transactionDetails.checkOutDate ?? '') },
                      { label: 'Duration', value: `${transactionDetails.duration ?? 1} day(s)` },
                    ]}
                  />
                </div>

                <div>
                  <InfoSection
                    title="User Details"
                    icon={<UserIcon />}
                    items={[
                      { label: 'Name', value: userInfo.name ?? (`${userInfo.firstName ?? ''} ${userInfo.lastName ?? ''}`.trim() || '—') },
                      { label: 'Email', value: userInfo.email ?? '—' },
                      { label: 'Contact', value: userInfo.contact ?? '—' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <InfoSection
                  title="Transaction"
                  icon={<ReceiptIcon />}
                  items={[
                    { label: 'Date', value: formatDate(transactionDetails.date ?? '') },
                    { label: 'Reference', value: transactionDetails.referenceNumber ?? '—' },
                    { label: 'Amount Paid', value: total ? `$${total.toFixed(2)}` : transactionDetails.totalAmount ? `$${transactionDetails.totalAmount.toFixed(2)}` : '—' },
                  ]}
                />
              </div>

              {/* Action row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                <div className="text-sm text-[#bdbdbd]">
                  A confirmation email has been sent to <span className="font-medium text-[#e6efe6]">{userInfo.email ?? '—'}</span>. Check spam if you don't see it.
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => window.print()} className="px-4 py-2 rounded-md bg-transparent border-white text-[#e6efe6] hover:bg-[#111] border">
                    Print
                  </button>

                  <Link to="/" className="px-4 py-2 rounded-md bg-[#2d5a3d] hover:bg-[#3b7a53] text-white text-center">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer small */}
          <div className="px-6 py-4 border-t border-[#151515] text-right text-xs text-[#9aa79a]">
            <div>Need help? Reply to the confirmation email or contact support.</div>
          </div>
        </div>
      </div>

      {/* If nothing found show friendly fallback */}
      {!hasAny && (
        <div className="max-w-2xl mx-auto mt-8 bg-[#111] border border-[#222] rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-[#e6efe6]">No booking found</h2>
          <p className="mt-2 text-sm text-[#bdbdbd]">We couldn’t find any booking data to show. If you just submitted a booking, try returning to the previous page.</p>
          <div className="mt-4">
            <Link to="/" className="px-4 py-2 rounded-md bg-[#2d5a3d] hover:bg-[#3b7a53] text-white">
              Back to home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
