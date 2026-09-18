export const DONATE_LINE_COUNT = 50;
export const DONATION_MOMENT_EVENT = 'ov:donation_moment';

export function recordValueMoment(kind) {
  // Value moment recorded
}

export function optOutOfDonationMoments() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('ov_opt_out_donation', 'true');
  }
}
