/**
 * 클라이언트에서 사용하는 보험료 데이터 타입 및 함수
 * API에서 불러온 데이터를 사용
 */

export type InsuranceType = "대리" | "탁송" | "확대탁송";
export type AgeGroup = "26~30" | "31~45" | "46~50" | "51~55" | "56~60" | "61~";
export type CoverageType =
  | "대인2"
  | "대인1특약"
  | "대물3천"
  | "대물5천"
  | "대물1억"
  | "대물2억"
  | "자손3천"
  | "자손5천"
  | "자손1억"
  | "자차1천"
  | "자차2천"
  | "자차3천"
  | "렌트비용"
  | "법률비용";

export interface PremiumData {
  insurance_type: InsuranceType;
  age_group: AgeGroup;
  daein2: number;
  daein1_special: number;
  daemul_3천: number;
  daemul_5천: number;
  daemul_1억: number;
  daemul_2억: number;
  jason_3천: number;
  jason_5천: number;
  jason_1억: number;
  jacha_1천: number;
  jacha_2천: number;
  jacha_3천: number;
  rent_cost: number | null;
  legal_cost: number;
}

/**
 * API에서 보험료 데이터 불러오기
 */
export async function fetchPremiumRates(): Promise<PremiumData[]> {
  const response = await fetch("/api/premium-rates", {
    cache: "no-store", // 항상 최신 데이터 사용
  });

  if (!response.ok) {
    throw new Error("Failed to fetch premium rates");
  }

  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.message || "Failed to fetch premium rates");
  }

  return result.data;
}

/**
 * 보험료 조회 함수
 */
export function getPremium(
  data: PremiumData[],
  insuranceType: InsuranceType,
  ageGroup: AgeGroup,
  coverage: CoverageType
): number | null {
  const item = data.find(
    (d) => d.insurance_type === insuranceType && d.age_group === ageGroup
  );

  if (!item) return null;

  switch (coverage) {
    case "대인2":
      return item.daein2;
    case "대인1특약":
      return item.daein1_special;
    case "대물3천":
      return item.daemul_3천;
    case "대물5천":
      return item.daemul_5천;
    case "대물1억":
      return item.daemul_1억;
    case "대물2억":
      return item.daemul_2억;
    case "자손3천":
      return item.jason_3천;
    case "자손5천":
      return item.jason_5천;
    case "자손1억":
      return item.jason_1억;
    case "자차1천":
      return item.jacha_1천;
    case "자차2천":
      return item.jacha_2천;
    case "자차3천":
      return item.jacha_3천;
    case "렌트비용":
      return item.rent_cost;
    case "법률비용":
      return item.legal_cost;
    default:
      return null;
  }
}

/**
 * 전체 보험료 계산 함수
 */
export function calculateTotalPremium(
  data: PremiumData[],
  insuranceType: InsuranceType,
  ageGroup: AgeGroup,
  selectedCoverages: {
    대인?: "대인2" | "대인1특약";
    대물?: "대물3천" | "대물5천" | "대물1억" | "대물2억";
    자손?: "자손3천" | "자손5천" | "자손1억";
    자차?: "자차1천" | "자차2천" | "자차3천";
    렌트비용?: boolean;
    법률비용?: boolean;
  }
): number {
  let total = 0;

  if (selectedCoverages.대인) {
    const premium = getPremium(data, insuranceType, ageGroup, selectedCoverages.대인);
    if (premium) total += premium;
  }

  if (selectedCoverages.대물) {
    const premium = getPremium(data, insuranceType, ageGroup, selectedCoverages.대물);
    if (premium) total += premium;
  }

  if (selectedCoverages.자손) {
    const premium = getPremium(data, insuranceType, ageGroup, selectedCoverages.자손);
    if (premium) total += premium;
  }

  if (selectedCoverages.자차) {
    const premium = getPremium(data, insuranceType, ageGroup, selectedCoverages.자차);
    if (premium) total += premium;
  }

  if (selectedCoverages.렌트비용) {
    const premium = getPremium(data, insuranceType, ageGroup, "렌트비용");
    if (premium) total += premium;
  }

  if (selectedCoverages.법률비용) {
    const premium = getPremium(data, insuranceType, ageGroup, "법률비용");
    if (premium) total += premium;
  }

  return total;
}
