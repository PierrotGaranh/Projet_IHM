export function validateField(field: string, value: string): string {
  const nameRegex = /^[A-Za-zÀ-ÿ\s-]{1,50}$/;
  const phoneRegex = /^[\d+\s-]{10,20}$/;
  const plateRegex = /^[A-Za-z0-9\s-]{1,15}$/;

  switch (field) {
    case 'firstName':
    case 'lastName':
      if (!value) return 'Ce champ est requis';
      if (!nameRegex.test(value)) return 'Lettres, espaces ou tirets (max 50)';
      return '';
    case 'email':
      if (!value) return 'Email requis';
      if (!value.includes('@') || value.length > 100) return 'Email invalide';
      return '';
    case 'password':
      if (!value) return 'Mot de passe requis';
      if (value.length < 6 || value.length > 100) return '6 à 100 caractères';
      return '';
    case 'phone':
      if (value && !phoneRegex.test(value)) return 'Téléphone invalide (10-20 chiffres, +, -, espace)';
      return '';
    case 'plate':
      if (value && !plateRegex.test(value)) return 'Plaque invalide (lettres, chiffres, -, espace)';
      return '';
    default:
      return '';
  }
}

export function validateDates(startDate: Date, endDate: Date): string {
  const now = new Date();
  if (startDate < now) return 'L\'horaire de début doit être aujourd\'hui ou ultérieure';
  if (startDate >= endDate) return 'L\'horaire de fin doit être postérieure à l\'horaire de début';
  return '';
}

export function validateForm(data: Record<string, any>, fields: string[]): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (field === 'dates' && data.startDate && data.endDate) {
      const dateError = validateDates(data.startDate, data.endDate);
      if (dateError) errors.dates = dateError;
    } else {
      const error = validateField(field, data[field] || '');
      if (error) errors[field] = error;
    }
  }
  return errors;
}