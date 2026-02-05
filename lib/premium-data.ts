/**
 * 보험료 데이터
 * 보험종목별, 나이대별, 담보별 보험료 정보
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
  insuranceType: InsuranceType;
  ageGroup: AgeGroup;
  coverages: {
    대인2: number;
    대인1특약: number;
    대물3천: number;
    대물5천: number;
    대물1억: number;
    대물2억: number;
    자손3천: number;
    자손5천: number;
    자손1억: number;
    자차1천: number;
    자차2천: number;
    자차3천: number;
    렌트비용: number | null;
    법률비용: number;
  };
}

/**
 * 보험료 데이터 테이블
 * 보험종목별, 나이대별 보험료 정보
 */
export const premiumTable: PremiumData[] = [
  // 대리 - 26~30
  {
    insuranceType: "대리",
    ageGroup: "26~30",
    coverages: {
      대인2: 362700,
      대인1특약: 342610,
      대물3천: 283460,
      대물5천: 298380,
      대물1억: 305070,
      대물2억: 323070,
      자손3천: 12860,
      자손5천: 17610,
      자손1억: 32010,
      자차1천: 232390,
      자차2천: 265750,
      자차3천: 296000,
      렌트비용: 50620,
      법률비용: 39770,
    },
  },
  // 대리 - 31~45
  {
    insuranceType: "대리",
    ageGroup: "31~45",
    coverages: {
      대인2: 278450,
      대인1특약: 263020,
      대물3천: 217610,
      대물5천: 229060,
      대물1억: 234210,
      대물2억: 248030,
      자손3천: 9870,
      자손5천: 13510,
      자손1억: 24570,
      자차1천: 178410,
      자차2천: 204020,
      자차3천: 227250,
      렌트비용: 54370,
      법률비용: 42710,
    },
  },
  // 대리 - 46~50
  {
    insuranceType: "대리",
    ageGroup: "46~50",
    coverages: {
      대인2: 301200,
      대인1특약: 284530,
      대물3천: 235420,
      대물5천: 247780,
      대물1억: 253360,
      대물2억: 268300,
      자손3천: 10670,
      자손5천: 14620,
      자손1억: 26590,
      자차1천: 193000,
      자차2천: 220690,
      자차3천: 245830,
      렌트비용: 45000,
      법률비용: 35360,
    },
  },
  // 대리 - 51~55
  {
    insuranceType: "대리",
    ageGroup: "51~55",
    coverages: {
      대인2: 371980,
      대인1특약: 351390,
      대물3천: 290730,
      대물5천: 306010,
      대물1억: 312890,
      대물2억: 331350,
      자손3천: 13180,
      자손5천: 18050,
      자손1억: 32830,
      자차1천: 238340,
      자차2천: 272550,
      자차3천: 303580,
      렌트비용: 45000,
      법률비용: 35360,
    },
  },
  // 대리 - 56~60
  {
    insuranceType: "대리",
    ageGroup: "56~60",
    coverages: {
      대인2: 414070,
      대인1특약: 391130,
      대물3천: 323620,
      대물5천: 340630,
      대물1억: 348280,
      대물2억: 368830,
      자손3천: 14680,
      자손5천: 20100,
      자손1억: 36560,
      자차1천: 265300,
      자차2천: 303400,
      자차3천: 337940,
      렌트비용: 45000,
      법률비용: 35360,
    },
  },
  // 대리 - 61~
  {
    insuranceType: "대리",
    ageGroup: "61~",
    coverages: {
      대인2: 518310,
      대인1특약: 489610,
      대물3천: 405090,
      대물5천: 426380,
      대물1억: 435970,
      대물2억: 461680,
      자손3천: 18380,
      자손5천: 25160,
      자손1억: 45750,
      자차1천: 332100,
      자차2천: 379770,
      자차3천: 423010,
      렌트비용: 45000,
      법률비용: 35360,
    },
  },
  // 탁송 - 26~30
  {
    insuranceType: "탁송",
    ageGroup: "26~30",
    coverages: {
      대인2: 391050,
      대인1특약: 375110,
      대물3천: 615720,
      대물5천: 648130,
      대물1억: 662570,
      대물2억: 697500,
      자손3천: 18490,
      자손5천: 25310,
      자손1억: 46080,
      자차1천: 462790,
      자차2천: 529420,
      자차3천: 589730,
      렌트비용: null,
      법률비용: 41450,
    },
  },
  // 탁송 - 31~45
  {
    insuranceType: "탁송",
    ageGroup: "31~45",
    coverages: {
      대인2: 253300,
      대인1특약: 243000,
      대물3천: 398800,
      대물5천: 419790,
      대물1억: 429170,
      대물2억: 451790,
      자손3천: 11960,
      자손5천: 16410,
      자손1억: 29830,
      자차1천: 299750,
      자차2천: 342940,
      자차3천: 381990,
      렌트비용: null,
      법률비용: 32400,
    },
  },
  // 탁송 - 46~50
  {
    insuranceType: "탁송",
    ageGroup: "46~50",
    coverages: {
      대인2: 299880,
      대인1특약: 287730,
      대물3천: 472200,
      대물5천: 497100,
      대물1억: 508190,
      대물2억: 534970,
      자손3천: 14180,
      자손5천: 19440,
      자손1억: 35350,
      자차1천: 354950,
      자차2천: 406040,
      자차3천: 452280,
      렌트비용: null,
      법률비용: 32400,
    },
  },
  // 탁송 - 51~55
  {
    insuranceType: "탁송",
    ageGroup: "51~55",
    coverages: {
      대인2: 314740,
      대인1특약: 301980,
      대물3천: 495660,
      대물5천: 521760,
      대물1억: 533420,
      대물2억: 561540,
      자손3천: 14870,
      자손5천: 20380,
      자손1억: 37100,
      자차1천: 372550,
      자차2천: 426190,
      자차3천: 474730,
      렌트비용: null,
      법률비용: 32400,
    },
  },
  // 탁송 - 56~60
  {
    insuranceType: "탁송",
    ageGroup: "56~60",
    coverages: {
      대인2: 352630,
      대인1특약: 338300,
      대물3천: 555290,
      대물5천: 584530,
      대물1억: 597590,
      대물2억: 629090,
      자손3천: 16680,
      자손5천: 22820,
      자손1억: 41560,
      자차1천: 417380,
      자차2천: 477450,
      자차3천: 531830,
      렌트비용: null,
      법률비용: 32400,
    },
  },
  // 탁송 - 61~
  {
    insuranceType: "탁송",
    ageGroup: "61~",
    coverages: {
      대인2: 373000,
      대인1특약: 357840,
      대물3천: 587310,
      대물5천: 618210,
      대물1억: 632040,
      대물2억: 665360,
      자손3천: 17620,
      자손5천: 24150,
      자손1억: 43970,
      자차1천: 441450,
      자차2천: 505000,
      자차3천: 562530,
      렌트비용: null,
      법률비용: 32400,
    },
  },
];

/**
 * 보험료 조회 함수
 * @param insuranceType 보험종목 (대리, 탁송)
 * @param ageGroup 나이대
 * @param coverage 담보 종류
 * @returns 보험료 (없으면 null)
 */
export function getPremium(
  insuranceType: InsuranceType,
  ageGroup: AgeGroup,
  coverage: CoverageType
): number | null {
  const data = premiumTable.find(
    (item) =>
      item.insuranceType === insuranceType && item.ageGroup === ageGroup
  );

  if (!data) return null;

  const coverageKey = coverage as keyof typeof data.coverages;
  return data.coverages[coverageKey] ?? null;
}

/**
 * 전체 보험료 계산 함수
 * 선택한 담보들의 합계를 계산
 */
export function calculateTotalPremium(
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
    const premium = getPremium(insuranceType, ageGroup, selectedCoverages.대인);
    if (premium) total += premium;
  }

  if (selectedCoverages.대물) {
    const premium = getPremium(insuranceType, ageGroup, selectedCoverages.대물);
    if (premium) total += premium;
  }

  if (selectedCoverages.자손) {
    const premium = getPremium(insuranceType, ageGroup, selectedCoverages.자손);
    if (premium) total += premium;
  }

  if (selectedCoverages.자차) {
    const premium = getPremium(insuranceType, ageGroup, selectedCoverages.자차);
    if (premium) total += premium;
  }

  if (selectedCoverages.렌트비용) {
    const premium = getPremium(insuranceType, ageGroup, "렌트비용");
    if (premium) total += premium;
  }

  if (selectedCoverages.법률비용) {
    const premium = getPremium(insuranceType, ageGroup, "법률비용");
    if (premium) total += premium;
  }

  return total;
}
