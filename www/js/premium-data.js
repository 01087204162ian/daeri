/**
 * 보험료 데이터 타입 및 함수 (클라이언트용)
 * PHP API에서 불러온 데이터 사용
 */

/**
 * API에서 보험료 데이터 불러오기
 */
async function fetchPremiumRates() {
    const response = await fetch('/api/premium-rates.php', {
        cache: 'no-store',
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch premium rates: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.ok) {
        throw new Error(result.message || 'Failed to fetch premium rates');
    }

    if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid data format');
    }

    return result.data;
}

/**
 * 보험료 조회 함수
 */
function getPremium(data, insuranceType, ageGroup, coverage) {
    const item = data.find(
        d => d.insurance_type === insuranceType && d.age_group === ageGroup
    );

    if (!item) return null;

    switch (coverage) {
        case '대인2':
            return item.daein2;
        case '대인1특약':
            return item.daein1_special;
        case '대물3천':
            return item['daemul_3천'];
        case '대물5천':
            return item['daemul_5천'];
        case '대물1억':
            return item['daemul_1억'];
        case '대물2억':
            return item['daemul_2억'];
        case '자손3천':
            return item['jason_3천'];
        case '자손5천':
            return item['jason_5천'];
        case '자손1억':
            return item['jason_1억'];
        case '자차1천':
            return item['jacha_1천'];
        case '자차2천':
            return item['jacha_2천'];
        case '자차3천':
            return item['jacha_3천'];
        case '렌트비용':
            return item.rent_cost;
        case '법률비용':
            return item.legal_cost;
        default:
            return null;
    }
}

/** 일시납 → 10회 납 적용 계수 (통상 10회 납 기준으로 표시) */
const PREMIUM_INSTALLMENT_FACTOR = 1.02;

/**
 * 전체 보험료 계산 함수
 * 계산 결과는 일시납 기준이며, 표시 시 10회 납 적용(×1.02)하여 반환합니다.
 */
function calculateTotalPremium(data, insuranceType, ageGroup, selectedCoverages) {
    let total = 0;

    if (selectedCoverages.대인) {
        const premium = getPremium(data, insuranceType, ageGroup, selectedCoverages.대인);
        if (premium !== null && premium !== undefined && !isNaN(premium)) {
            total += Number(premium);
        }
    }

    if (selectedCoverages.대물) {
        const premium = getPremium(data, insuranceType, ageGroup, selectedCoverages.대물);
        if (premium !== null && premium !== undefined && !isNaN(premium)) {
            total += Number(premium);
        }
    }

    if (selectedCoverages.자손) {
        const premium = getPremium(data, insuranceType, ageGroup, selectedCoverages.자손);
        if (premium !== null && premium !== undefined && !isNaN(premium)) {
            total += Number(premium);
        }
    }

    if (selectedCoverages.자차) {
        const premium = getPremium(data, insuranceType, ageGroup, selectedCoverages.자차);
        if (premium !== null && premium !== undefined && !isNaN(premium)) {
            total += Number(premium);
        }
    }

    if (selectedCoverages.렌트비용) {
        const premium = getPremium(data, insuranceType, ageGroup, '렌트비용');
        if (premium !== null && premium !== undefined && !isNaN(premium)) {
            total += Number(premium);
        }
    }

    if (selectedCoverages.법률비용) {
        const premium = getPremium(data, insuranceType, ageGroup, '법률비용');
        if (premium !== null && premium !== undefined && !isNaN(premium)) {
            total += Number(premium);
        }
    }

    /* 일시납 합계에 10회 납 계수 적용 */
    return Math.round(total * PREMIUM_INSTALLMENT_FACTOR);
}
