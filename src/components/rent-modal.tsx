import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router';

/* ---------------------------
   Development toggles
   --------------------------- */
const USE_DUMMY_DATA = true; // <-- Set to false in production
const AUTO_OPEN_FOR_TESTING = false; // <-- If true, modal auto-opens (handy for dev)

/* ---------------------------
   Types & Initial (empty) data
   --------------------------- */
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  aadhar: string;
  pan: string;
  dlNumber: string;
  dlStartDate: string;
  dlExpiryDate: string;
  rentalPurpose: string;
  bikingExperience: string;
  emergencyName: string;
  emergencyPhone: string;
  specialRequests: string;
  checkInDate: string;
  checkOutDate: string;
  duration: number;
}

/* ORIGINAL (empty) initial data - kept here commented for reference and restore */
const ORIGINAL_INITIAL_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: '',
  aadhar: '',
  pan: '',
  dlNumber: '',
  dlStartDate: '',
  dlExpiryDate: '',
  rentalPurpose: '',
  bikingExperience: '',
  emergencyName: '',
  emergencyPhone: '',
  specialRequests: '',
  checkInDate: '',
  checkOutDate: '',
  duration: 0,
};

const DUMMY_DATA: FormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  age: '30',
  aadhar: '123412341234',
  pan: 'ABCDE1234F',
  dlNumber: 'DLTEST12345',
  dlStartDate: '2020-01-01',
  dlExpiryDate: '2030-01-01',
  rentalPurpose: 'recreation',
  bikingExperience: 'I ride 2-3 times a week on roads and light trails.',
  emergencyName: 'Jane Doe',
  emergencyPhone: '9123456789',
  specialRequests: 'No special requests — test booking.',
  checkInDate: '2024-07-20',
  checkOutDate: '2024-07-25',
  duration: 5,
};

/* Use either DUMMY_DATA (for testing) or the original empty data */
const initialData: FormData = USE_DUMMY_DATA ? { ...DUMMY_DATA } : { ...ORIGINAL_INITIAL_DATA };

/* ---------------------------
   Component
   --------------------------- */
export default function RentModal(): JSX.Element {
  const navigate = useNavigate();
  // Auto-open for testing if enabled
  const [isOpen, setIsOpen] = useState<boolean>(AUTO_OPEN_FOR_TESTING ? true : false);
  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    resetForm();
  };

  const [data, setData] = useState<FormData>({ ...initialData });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [step, setStep] = useState<number>(1);

  // basic validators
  const validators: Record<string, (val: string) => string | null> = {
    firstName: (v) => (v.trim() ? null : 'First name is required'),
    lastName: (v) => (v.trim() ? null : 'Last name is required'),
    email: (v) => (!v ? 'Email is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email'),
    phone: (v) => (!v ? 'Phone number is required' : /^\d{10}$/.test(v.replace(/\D/g, '')) ? null : 'Enter a 10-digit phone number'),
    age: (v) => (!v ? 'Age is required' : Number(v) >= 18 ? null : 'You must be at least 18 years old'),
    aadhar: (v) => (!v ? 'Aadhar number required' : /^\d{12}$/.test(v.replace(/\s/g, '')) ? null : 'Aadhar must be 12 digits'),
    pan: (v) => (!v ? 'PAN is required' : /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(v.replace(/\s/g, '')) ? null : 'PAN format invalid (e.g. ABCDE1234F)'),
    dlNumber: (v) => (v.trim() ? null : 'Driving license number required'),
    dlStartDate: (v) => (!v ? 'DL start date required' : null),
    dlExpiryDate: (v) => (!v ? 'DL expiry date required' : null),
    rentalPurpose: (v) => (v ? null : 'Select a purpose'),
    // emergency
    emergencyName: (v) => (v.trim() ? null : 'Emergency contact name required'),
    emergencyPhone: (v) => (!v ? 'Emergency contact phone required' : /^\d{10}$/.test(v.replace(/\D/g, '')) ? null : 'Enter a 10-digit phone number'),
    // others are optional
    bikingExperience: () => null,
    specialRequests: () => null,
  };

  // run validations for a set of fields (keys)
  function validateFields(keys: Array<keyof FormData>) {
    const newErrors: Partial<Record<keyof FormData, string>> = { ...errors };
    keys.forEach((k) => {
      const fn = validators[k as string];
      if (fn) {
        const res = fn(String(data[k]));
        if (res) newErrors[k] = res;
        else delete newErrors[k];
      }
    });

    // cross-field rule: dlExpiryDate should be after start date
    if (data.dlStartDate && data.dlExpiryDate) {
      const start = new Date(data.dlStartDate);
      const exp = new Date(data.dlExpiryDate);
      if (exp < start) {
        newErrors.dlExpiryDate = 'Expiry must be after start date';
      } else {
        if (newErrors.dlExpiryDate === 'Expiry must be after start date') delete newErrors.dlExpiryDate;
      }
    }

    setErrors(newErrors);
    return newErrors;
  }

  // overall validity
  function isFormValid() {
    const allKeys = Object.keys(validators) as Array<keyof FormData>;
    const newErrors = validateFields(allKeys);
    return Object.keys(newErrors).length === 0;
  }

  // input change helper
  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setTouched((t) => ({ ...t, [key]: true }));
  }

  // Next / Prev handlers (simple step navigation)
  function validateStep(s: number) {
    if (s === 1) {
      const keys: Array<keyof FormData> = ['firstName', 'lastName', 'email', 'phone', 'age', 'aadhar', 'pan', 'dlNumber', 'dlStartDate', 'dlExpiryDate'];
      const newErrors = validateFields(keys);
      return Object.keys(newErrors).length === 0;
    } else {
      const keys: Array<keyof FormData> = ['rentalPurpose', 'emergencyName', 'emergencyPhone'];
      const newErrors = validateFields(keys);
      return Object.keys(newErrors).length === 0;
    }
  }

  function handleNext() {
    const ok = validateStep(step);
    if (!ok) {
      // mark step fields touched to show errors
      setTouched((t) => {
        const next = { ...t };
        if (step === 1) {
          ['firstName', 'lastName', 'email', 'phone', 'age', 'aadhar', 'pan', 'dlNumber', 'dlStartDate', 'dlExpiryDate'].forEach((k) => (next[k] = true));
        } else {
          ['rentalPurpose', 'emergencyName', 'emergencyPhone'].forEach((k) => (next[k] = true));
        }
        return next;
      });
      return;
    }
    setStep((s) => s + 1);
  }

  function handlePrev() {
    setStep((s) => Math.max(1, s - 1));
  }

  // form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true); // Mark form submitted to show errors if any

    // final validation
    const ok = isFormValid();
    if (!ok) {
      // mark all touched to show errors on all invalid fields
      const allKeys = Object.keys(validators);
      setTouched((t) => {
        const next = { ...t };
        allKeys.forEach((k) => (next[k] = true));
        return next;
      });
      return;
    }

    try {
      setSubmitting(true);
      let attempts = 0;
      const maxAttempts = 3;
      const baseDelay = 500; // milliseconds

      while (attempts < maxAttempts) {
        try {
          // Simulate API call with a random chance of failure
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              if (Math.random() > 0.7) {
                // 30% chance of failure
                reject(new Error('Simulated network error or server issue.'));
              } else {
                resolve(true);
              }
            }, 800);
          });

          // If successful, break the loop
          break;
        } catch (error) {
          attempts++;
          console.error(`Attempt ${attempts} failed:`, error);
          if (attempts < maxAttempts) {
            const delay = baseDelay * Math.pow(2, attempts - 1);
            console.log(`Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw error; // Re-throw error if max attempts reached
          }
        }
      }

      // success — replace with real submit logic
      console.log('FORM SUBMITTED:', data);

      const bikeInfo = {
        make: 'Example Make', // Replace with actual bike data from your form or context
        model: 'Example Model',
        serialNumber: 'EX12345',
      };

      const userInfo = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phone,
      };

      const transactionDetails = {
        date: new Date().toLocaleDateString(),
        referenceNumber: `REF-${Math.floor(Math.random() * 1000000)}`,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        duration: data.duration,
      };

      navigate('/confirmation', {
        state: { bikeInfo, userInfo, transactionDetails, checkInDate: data.checkInDate, checkOutDate: data.checkOutDate, duration: data.duration },
      });

      // show simple success (you can replace with toast)
      // alert('Booking request submitted!');

      // reset and close
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Form submission failed after multiple retries:', error);
      alert(`Booking request failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setData({ ...(USE_DUMMY_DATA ? DUMMY_DATA : ORIGINAL_INITIAL_DATA) }); // restore to chosen baseline
    setErrors({});
    setTouched({});
    setSubmitting(false);
    setFormSubmitted(false);
    setStep(1);
  }

  // live validation when data changes (only if form has been submitted or fields touched)
  useEffect(() => {
    if (formSubmitted) {
      const allKeys = Object.keys(validators) as (keyof FormData)[];
      validateFields(allKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, formSubmitted]);

  // UI helpers
  const showError = (key: keyof FormData) => !!(formSubmitted && errors[key]);
  const errorMessage = (key: keyof FormData) => (errors[key] ? errors[key] : '');

  return (
    <>
      {/* Trigger */}
      <button
        onClick={open}
        type="button"
        className="inline-flex items-center cursor-pointer gap-3 bg-[#111] hover:bg-[#141414] border border-[#222] text-[#4a9d6a] px-6 py-4 rounded-2xl shadow-[inset_0_-6px_16px_rgba(0,0,0,0.35)] transition"
        aria-label="Rent this bike now">
        <Calendar className="w-5 h-5" />
        <span className="font-semibold">Rent This Bike Now</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" aria-modal="true" role="dialog" onClick={close}>
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl bg-[#1b1b1b] border border-[#2b2b2b] shadow-lg" onClick={(e) => e.stopPropagation()}>
            <header className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
              <h3 className="text-2xl font-bold text-[#e6efe6]">Bike Rental — Booking</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                  className="text-sm px-3 py-1 rounded-md bg-transparent text-[#bdbdbd] hover:bg-[#222] transition"
                  aria-label="Cancel booking">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                  }}
                  aria-label="Close"
                  className="text-[#bdbdbd] hover:text-white rounded p-1">
                  ✕
                </button>
              </div>
            </header>

            <form onSubmit={handleSubmit} className="px-6 pb-6">
              <section>
                <h4 className="text-lg font-semibold text-[#e6efe6] mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First name */}
                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">First name *</label>
                    <input
                      value={data.firstName}
                      onChange={(e) => setField('firstName', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('firstName') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      placeholder="John"
                      required
                      type="text"
                    />
                    {showError('firstName') && <div className="text-xs text-red-400 mt-1">{errorMessage('firstName')}</div>}
                  </div>

                  {/* Last name */}
                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">Last name *</label>
                    <input
                      value={data.lastName}
                      onChange={(e) => setField('lastName', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('lastName') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      placeholder="Doe"
                      required
                      type="text"
                    />
                    {showError('lastName') && <div className="text-xs text-red-400 mt-1">{errorMessage('lastName')}</div>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">Email *</label>
                    <input
                      value={data.email}
                      onChange={(e) => setField('email', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('email') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      placeholder="you@domain.com"
                      required
                      type="email"
                    />
                    {showError('email') && <div className="text-xs text-red-400 mt-1">{errorMessage('email')}</div>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">Phone number *</label>
                    <input
                      value={data.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('phone') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      placeholder="10-digit number"
                      required
                      type="tel"
                      inputMode="numeric"
                    />
                    {showError('phone') && <div className="text-xs text-red-400 mt-1">{errorMessage('phone')}</div>}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">Age *</label>
                    <input
                      value={data.age}
                      onChange={(e) => setField('age', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('age') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      placeholder="18"
                      required
                      type="number"
                      min={18}
                    />
                    {showError('age') && <div className="text-xs text-red-400 mt-1">{errorMessage('age')}</div>}
                  </div>

                  {/* Aadhar */}
                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">Aadhar Number *</label>
                    <input
                      value={data.aadhar}
                      onChange={(e) => setField('aadhar', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('aadhar') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      placeholder="12-digit Aadhar"
                      required
                      type="text"
                      inputMode="numeric"
                    />
                    {showError('aadhar') && <div className="text-xs text-red-400 mt-1">{errorMessage('aadhar')}</div>}
                  </div>

                  {/* PAN */}
                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">PAN Number *</label>
                    <input
                      value={data.pan}
                      onChange={(e) => setField('pan', e.target.value.toUpperCase())}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('pan') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      placeholder="ABCDE1234F"
                      required
                      type="text"
                    />
                    {showError('pan') && <div className="text-xs text-red-400 mt-1">{errorMessage('pan')}</div>}
                  </div>

                  {/* DL Number */}
                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">Driving License Number *</label>
                    <input
                      value={data.dlNumber}
                      onChange={(e) => setField('dlNumber', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('dlNumber') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      placeholder="DL number"
                      required
                      type="text"
                    />
                    {showError('dlNumber') && <div className="text-xs text-red-400 mt-1">{errorMessage('dlNumber')}</div>}
                  </div>

                  {/* DL Start */}
                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">DL Start Date *</label>
                    <input
                      value={data.dlStartDate}
                      onChange={(e) => setField('dlStartDate', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('dlStartDate') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      required
                      type="date"
                    />
                    {showError('dlStartDate') && <div className="text-xs text-red-400 mt-1">{errorMessage('dlStartDate')}</div>}
                  </div>

                  {/* DL Expiry */}
                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">DL Expiry Date *</label>
                    <input
                      value={data.dlExpiryDate}
                      onChange={(e) => setField('dlExpiryDate', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('dlExpiryDate') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      required
                      type="date"
                    />
                    {showError('dlExpiryDate') && <div className="text-xs text-red-400 mt-1">{errorMessage('dlExpiryDate')}</div>}
                  </div>

                  {/* Rental Details & Emergency Contact */}
                  <h4 className="text-lg font-semibold text-[#e6efe6] mb-4 col-span-full">Rental Details & Emergency Contact</h4>

                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">Purpose of Rental *</label>
                    <select
                      value={data.rentalPurpose}
                      onChange={(e) => setField('rentalPurpose', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('rentalPurpose') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      required>
                      <option value="">Select purpose</option>
                      <option value="leisure">Leisure</option>
                      <option value="commute">Commute</option>
                      <option value="adventure">Adventure</option>
                      <option value="other">Other</option>
                    </select>
                    {showError('rentalPurpose') && <div className="text-xs text-red-400 mt-1">{errorMessage('rentalPurpose')}</div>}
                  </div>

                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">Biking Experience</label>
                    <select
                      value={data.bikingExperience}
                      onChange={(e) => setField('bikingExperience', e.target.value)}
                      className="w-full rounded-md px-3 py-2 bg-[#111] border border-[#2b2b2b] text-white">
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">Emergency Contact Name *</label>
                    <input
                      value={data.emergencyName}
                      onChange={(e) => setField('emergencyName', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('emergencyName') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      placeholder="Emergency contact name"
                      required
                      type="text"
                    />
                    {showError('emergencyName') && <div className="text-xs text-red-400 mt-1">{errorMessage('emergencyName')}</div>}
                  </div>

                  <div>
                    <label className="block text-sm text-[#d1d1d1] mb-1">Emergency Contact Phone *</label>
                    <input
                      value={data.emergencyPhone}
                      onChange={(e) => setField('emergencyPhone', e.target.value)}
                      className={`w-full rounded-md px-3 py-2 bg-[#111] border ${showError('emergencyPhone') ? 'border-red-500' : 'border-[#2b2b2b]'} text-white`}
                      placeholder="10-digit number"
                      required
                      type="tel"
                      inputMode="numeric"
                    />
                    {showError('emergencyPhone') && <div className="text-xs text-red-400 mt-1">{errorMessage('emergencyPhone')}</div>}
                  </div>

                  <div className="col-span-full">
                    <label className="block text-sm text-[#d1d1d1] mb-1">Special Requests</label>
                    <textarea
                      value={data.specialRequests}
                      onChange={(e) => setField('specialRequests', e.target.value)}
                      className="w-full rounded-md px-3 py-2 bg-[#111] border border-[#2b2b2b] text-white"
                      rows={3}
                      placeholder="Any special requests or notes..."
                    />
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="flex justify-between items-center px-6 py-4 border-t border-[#262626] mt-6 gap-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={step === 1}
                    className={`px-4 py-2 rounded-lg ${step === 1 ? 'bg-[#262626] text-[#666]' : 'bg-[#222] text-[#d1d1d1] hover:bg-[#2a2a2a]'}`}>
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 rounded-lg bg-linaear-to-tr from-[#2d5a3d] to-[#4a9d6a] text-white hover:from-[#3b7a53] hover:to-[#5fbf80] transition">
                    Next
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-transparent text-[#d1d1d1] border border-[#2b2b2b] hover:bg-[#222]">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-lg bg-[#2d5a3d] hover:bg-[#397a4e] text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? 'Submitting...' : 'Submit Booking'}
                  </button>
                </div>
              </footer>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
