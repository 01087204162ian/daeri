/**
 * 주민번호 유효성 검사 및 나이 계산 유틸리티
 */

/**
 * 주민번호 유효성 검사
 * @param front 앞 6자리 (YYMMDD)
 * @param back 뒤 7자리
 * @returns 유효성 검사 결과
 */
export function validateResidentNumber(front: string, back: string): {
  isValid: boolean;
  error?: string;
  age?: number;
  ageGroup?: "26~30" | "31~45" | "46~50" | "51~55" | "56~60" | "61~";
} {
  // 기본 검증
  if (!front || !back) {
    return { isValid: false, error: "주민번호를 입력해주세요" };
  }

  if (front.length !== 6 || back.length !== 7) {
    return { isValid: false, error: "주민번호 형식이 올바르지 않습니다" };
  }

  // 숫자만 허용
  if (!/^\d{6}$/.test(front) || !/^\d{7}$/.test(back)) {
    return { isValid: false, error: "주민번호는 숫자만 입력 가능합니다" };
  }

  // 생년월일 검증
  const year = parseInt(front.substring(0, 2));
  const month = parseInt(front.substring(2, 4));
  const day = parseInt(front.substring(4, 6));

  if (month < 1 || month > 12) {
    return { isValid: false, error: "생년월일이 올바르지 않습니다" };
  }

  if (day < 1 || day > 31) {
    return { isValid: false, error: "생년월일이 올바르지 않습니다" };
  }

  // 체크섬 검증
  const checkDigit = parseInt(back.charAt(6));
  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  const digits = (front + back.substring(0, 6)).split("").map(Number);
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * weights[i];
  }
  
  const remainder = sum % 11;
  const calculatedCheckDigit = (11 - remainder) % 10;

  if (checkDigit !== calculatedCheckDigit) {
    return { isValid: false, error: "주민번호가 올바르지 않습니다" };
  }

  // 나이 계산
  const genderCode = parseInt(back.charAt(0));
  let fullYear: number;

  // 성별 코드로 세기 판단
  if (genderCode === 1 || genderCode === 2) {
    // 1900년대
    fullYear = 1900 + year;
  } else if (genderCode === 3 || genderCode === 4) {
    // 2000년대
    fullYear = 2000 + year;
  } else {
    return { isValid: false, error: "주민번호가 올바르지 않습니다" };
  }

  // 현재 나이 계산
  const today = new Date();
  const birthDate = new Date(fullYear, month - 1, day);
  let age = today.getFullYear() - fullYear;
  const monthDiff = today.getMonth() - (month - 1);
  const dayDiff = today.getDate() - day;

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  // 나이대 계산
  let ageGroup: "26~30" | "31~45" | "46~50" | "51~55" | "56~60" | "61~";
  if (age < 26) {
    return { isValid: false, error: "만 26세 이상만 가입 가능합니다" };
  } else if (age <= 30) {
    ageGroup = "26~30";
  } else if (age <= 45) {
    ageGroup = "31~45";
  } else if (age <= 50) {
    ageGroup = "46~50";
  } else if (age <= 55) {
    ageGroup = "51~55";
  } else if (age <= 60) {
    ageGroup = "56~60";
  } else {
    ageGroup = "61~";
  }

  return { isValid: true, age, ageGroup };
}
