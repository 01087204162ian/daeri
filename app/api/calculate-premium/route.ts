import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { validateResidentNumber } from "@/lib/resident-number";

export const runtime = "nodejs";

/**
 * 주민번호와 보험 유형으로 보험료 계산 API
 * POST /api/calculate-premium
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { residentNumber1, residentNumber2, insuranceType } = body;

    // 입력값 검증
    if (!residentNumber1 || !residentNumber2 || !insuranceType) {
      return NextResponse.json(
        { ok: false, error: "MISSING_PARAMS", message: "주민번호와 보험 유형을 입력해주세요" },
        { status: 400 }
      );
    }

    // 주민번호 유효성 검사
    const validation = validateResidentNumber(residentNumber1, residentNumber2);
    if (!validation.isValid) {
      return NextResponse.json(
        { ok: false, error: "INVALID_RESIDENT_NUMBER", message: validation.error },
        { status: 400 }
      );
    }

    const { age, ageGroup } = validation;

    // 보험료 조회 함수
    const getPremiumData = async (insuranceType: string) => {
      const rows = await query<any[]>(
        `SELECT 
          insurance_type,
          age_group,
          daein2,
          daein1_special,
          \`daemul_3천\` as daemul_3천,
          \`daemul_5천\` as daemul_5천,
          \`daemul_1억\` as daemul_1억,
          \`daemul_2억\` as daemul_2억,
          \`jason_3천\` as jason_3천,
          \`jason_5천\` as jason_5천,
          \`jason_1억\` as jason_1억,
          \`jacha_1천\` as jacha_1천,
          \`jacha_2천\` as jacha_2천,
          \`jacha_3천\` as jacha_3천,
          rent_cost,
          legal_cost
        FROM premium_rates
        WHERE insurance_type = ?
          AND age_group = ?
          AND is_active = true
          AND (effective_date IS NULL OR effective_date <= CURDATE())
          AND (expiry_date IS NULL OR expiry_date >= CURDATE())
        LIMIT 1`,
        [insuranceType, ageGroup]
      );
      return rows && rows.length > 0 ? rows[0] : null;
    };

    let premiumData: any;

    // 대리+탁송 또는 대리+확대탁송인 경우 두 보험료 합산
    if (insuranceType === "daeri-taksong") {
      const daeriPremium = await getPremiumData("대리");
      const taksongPremium = await getPremiumData("탁송");

      if (!daeriPremium || !taksongPremium) {
        return NextResponse.json(
          { ok: false, error: "PREMIUM_NOT_FOUND", message: "해당 조건의 보험료를 찾을 수 없습니다" },
          { status: 404 }
        );
      }

      // 두 보험료 합산
      premiumData = {
        insurance_type: "대리+탁송",
        age_group: ageGroup,
        daein2: daeriPremium.daein2 + taksongPremium.daein2,
        daein1_special: daeriPremium.daein1_special + taksongPremium.daein1_special,
        daemul_3천: daeriPremium.daemul_3천 + taksongPremium.daemul_3천,
        daemul_5천: daeriPremium.daemul_5천 + taksongPremium.daemul_5천,
        daemul_1억: daeriPremium.daemul_1억 + taksongPremium.daemul_1억,
        daemul_2억: daeriPremium.daemul_2억 + taksongPremium.daemul_2억,
        jason_3천: daeriPremium.jason_3천 + taksongPremium.jason_3천,
        jason_5천: daeriPremium.jason_5천 + taksongPremium.jason_5천,
        jason_1억: daeriPremium.jason_1억 + taksongPremium.jason_1억,
        jacha_1천: daeriPremium.jacha_1천 + taksongPremium.jacha_1천,
        jacha_2천: daeriPremium.jacha_2천 + taksongPremium.jacha_2천,
        jacha_3천: daeriPremium.jacha_3천 + taksongPremium.jacha_3천,
        rent_cost: daeriPremium.rent_cost, // 대리만 렌트비용 있음
        legal_cost: daeriPremium.legal_cost + taksongPremium.legal_cost,
      };
    } else if (insuranceType === "daeri-hwakdae") {
      const daeriPremium = await getPremiumData("대리");
      const hwakdaePremium = await getPremiumData("확대탁송");

      if (!daeriPremium || !hwakdaePremium) {
        return NextResponse.json(
          { ok: false, error: "PREMIUM_NOT_FOUND", message: "해당 조건의 보험료를 찾을 수 없습니다" },
          { status: 404 }
        );
      }

      // 두 보험료 합산
      premiumData = {
        insurance_type: "대리+확대탁송",
        age_group: ageGroup,
        daein2: daeriPremium.daein2 + hwakdaePremium.daein2,
        daein1_special: daeriPremium.daein1_special + hwakdaePremium.daein1_special,
        daemul_3천: daeriPremium.daemul_3천 + hwakdaePremium.daemul_3천,
        daemul_5천: daeriPremium.daemul_5천 + hwakdaePremium.daemul_5천,
        daemul_1억: daeriPremium.daemul_1억 + hwakdaePremium.daemul_1억,
        daemul_2억: daeriPremium.daemul_2억 + hwakdaePremium.daemul_2억,
        jason_3천: daeriPremium.jason_3천 + hwakdaePremium.jason_3천,
        jason_5천: daeriPremium.jason_5천 + hwakdaePremium.jason_5천,
        jason_1억: daeriPremium.jason_1억 + hwakdaePremium.jason_1억,
        jacha_1천: daeriPremium.jacha_1천 + hwakdaePremium.jacha_1천,
        jacha_2천: daeriPremium.jacha_2천 + hwakdaePremium.jacha_2천,
        jacha_3천: daeriPremium.jacha_3천 + hwakdaePremium.jacha_3천,
        rent_cost: daeriPremium.rent_cost, // 대리만 렌트비용 있음
        legal_cost: daeriPremium.legal_cost + hwakdaePremium.legal_cost,
      };
    } else {
      // 단일 보험 유형 (대리, 탁송, 확대탁송)
      const insuranceTypeMap: Record<string, string> = {
        daeri: "대리",
        taksong: "탁송",
        hwakdae: "확대탁송",
      };

      const dbInsuranceType = insuranceTypeMap[insuranceType] || insuranceType;
      premiumData = await getPremiumData(dbInsuranceType);

      if (!premiumData) {
        return NextResponse.json(
          { ok: false, error: "PREMIUM_NOT_FOUND", message: "해당 조건의 보험료를 찾을 수 없습니다" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        age,
        ageGroup,
        insuranceType: premiumData.insurance_type,
        premium: premiumData,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UNKNOWN";
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", message: msg }, { status: 500 });
  }
}
