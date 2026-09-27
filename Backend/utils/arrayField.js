// File name: arrayField.js
// Save at: Backend/utils/arrayField.js
//
// `category` and `course_type` used to store one plain string each
// (e.g. "SC"). Now that both fields support multiple selections, each
// column stores a JSON-encoded array string instead (e.g. '["SC","ST"]").
// The column type in MySQL does NOT need to change (VARCHAR/TEXT is fine
// either way) — only how we read/write it in JS changes.
//
// These helpers keep that encoding in one place so the controllers just
// work with plain arrays.

// Turn whatever the frontend sent (an array, a single leftover string, or
// nothing) into a clean array ready to be JSON-encoded for storage.
export const toStoredValue = (value) => {
  const arr = Array.isArray(value) ? value : value ? [value] : [];
  return JSON.stringify(arr);
};

// Turn whatever is in the database column into a plain array. Handles:
//  - the new format: a JSON array string, e.g. '["SC","ST"]'
//  - old rows saved before this feature existed: a bare string, e.g. "SC"
//  - empty/null columns
export const fromStoredValue = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw === null || raw === undefined || raw === "") return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return [String(raw)]; // legacy single value, e.g. "SC" or "All"
  }
};

// Eligibility match for one field: true if the scholarship's allowed list
// includes the wildcard ("All" for category, "Any" for course_type), or if
// at least one of the student's selected values is in the allowed list.
export const overlapsOrWildcard = (allowed, selected, wildcard) => {
  if (allowed.includes(wildcard)) return true;
  return selected.some((value) => allowed.includes(value));
};
