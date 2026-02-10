/**
 * 보험료 산출기
 */

let premiumData = [];
let loading = false;
let calculated = false;

// 상태 — 기본: 대인 책임초과무한, 대물 1억, 자손 3천, 자차 3천
let daein = '책임초과무한'; // 책임초과무한 = 대인2, 책임포함무한 = 대인2+대인1특약
let daemul = '1억';
let jason = '3천';
let jacha = '3천';
let rentCost = false; // 렌트비용
let legalCost = true; // 법률비용 (기본값: 포함)

/**
 * 나이대별 생년월일 범위 계산
 */
function calculateAgeRange(ageGroup) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    let minAge, maxAge;

    switch (ageGroup) {
        case '26~30':
            minAge = 26;
            maxAge = 30;
            break;
        case '31~45':
            minAge = 31;
            maxAge = 45;
            break;
        case '46~50':
            minAge = 46;
            maxAge = 50;
            break;
        case '51~55':
            minAge = 51;
            maxAge = 55;
            break;
        case '56~60':
            minAge = 56;
            maxAge = 60;
            break;
        case '61~':
            const birthYear61 = currentYear - 61;
            const birthDate61 = new Date(birthYear61, currentMonth, currentDay);
            if (birthDate61 > today) {
                birthDate61.setFullYear(birthYear61 - 1);
            }
            return `[ ~ ${birthDate61.toISOString().split('T')[0]} ]`;
        default:
            return '';
    }

    // 최대 나이의 생년월일 (가장 어린 경우)
    const maxBirthYear = currentYear - maxAge;
    const maxBirthDate = new Date(maxBirthYear, currentMonth, currentDay);
    if (maxBirthDate > today) {
        maxBirthDate.setFullYear(maxBirthYear - 1);
    }

    // 최소 나이의 생년월일 (가장 나이 많은 경우)
    const minBirthYear = currentYear - minAge;
    const minBirthDate = new Date(minBirthYear, currentMonth, currentDay);
    if (minBirthDate > today) {
        minBirthDate.setFullYear(minBirthYear - 1);
    }
    minBirthDate.setDate(minBirthDate.getDate() - 1);

    const minDateStr = maxBirthDate.toISOString().split('T')[0];
    const maxDateStr = minBirthDate.toISOString().split('T')[0];

    return `[ ${minDateStr} ~ ${maxDateStr} ]`;
}

const ageGroups = [
    { label: '26세~30세', range: calculateAgeRange('26~30'), ageGroup: '26~30' },
    { label: '31세~45세', range: calculateAgeRange('31~45'), ageGroup: '31~45' },
    { label: '46세~50세', range: calculateAgeRange('46~50'), ageGroup: '46~50' },
    { label: '51세~55세', range: calculateAgeRange('51~55'), ageGroup: '51~55' },
    { label: '56세~60세', range: calculateAgeRange('56~60'), ageGroup: '56~60' },
    { label: '61세 이상', range: calculateAgeRange('61~'), ageGroup: '61~' },
];

/**
 * 보험료 계산 함수 (테이블용)
 */
function calculatePremiumForTable(insuranceType, ageGroup) {
    if (premiumData.length === 0) {
        return 0;
    }
    
    // calculateTotalPremium 함수가 전역 스코프에 있는지 확인
    if (typeof calculateTotalPremium !== 'function') {
        return 0;
    }

    const 대인 = daein === '책임초과무한' ? '대인2' : '대인1특약';
    const 대물 = `대물${daemul}`;
    const 자손 = `자손${jason}`;
    const 자차 = `자차${jacha}`;

    try {
        // 책임포함무한인 경우 대인2 + 대인1특약을 모두 더해야 함
        if (daein === '책임포함무한') {
            const 대인2보험료 = calculateTotalPremium(premiumData, insuranceType, ageGroup, {
                대인: '대인2',
                대물: 대물,
                자손: 자손,
                자차: 자차,
                렌트비용: rentCost,
                법률비용: legalCost,
            });
            
            const 대인1특약보험료 = calculateTotalPremium(premiumData, insuranceType, ageGroup, {
                대인: '대인1특약',
                대물: undefined,
                자손: undefined,
                자차: undefined,
                렌트비용: false,
                법률비용: false,
            });
            
            return (Number(대인2보험료) || 0) + (Number(대인1특약보험료) || 0);
        } else {
            // 책임초과무한 = 대인2만
            const result = calculateTotalPremium(premiumData, insuranceType, ageGroup, {
                대인: '대인2',
                대물: 대물,
                자손: 자손,
                자차: 자차,
                렌트비용: rentCost,
                법률비용: legalCost,
            });
            return Number(result) || 0;
        }
    } catch (error) {
        return 0;
    }
}

/**
 * 보험료 산출기 HTML 생성
 */
function renderPremiumCalculator() {
    const container = document.getElementById('premium-calculator-container');
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = `
        <div class="premium-calculator-card">
            <!-- Header -->
            <div class="premium-calculator-header">
                <h2 class="premium-calculator-header-title">
                    보험료 적용 기준일 <span class="premium-calculator-date">${today}</span>
                </h2>
            </div>

            <!-- Filters -->
            <div class="premium-calculator-filters">
                <div class="premium-calculator-filters-grid">
                    <select id="daein-select" class="premium-select premium-select-wide">
                        <option value="책임초과무한">대인: 책임초과 무한</option>
                        <option value="책임포함무한">대인: 책임포함 무한</option>
                    </select>

                    <select id="daemul-select" class="premium-select">
                        <option value="3천">대물: 3천</option>
                        <option value="5천">대물: 5천</option>
                        <option value="1억">대물: 1억</option>
                        <option value="2억">대물: 2억</option>
                    </select>

                    <select id="jason-select" class="premium-select">
                        <option value="3천">자손: 3천</option>
                        <option value="5천">자손: 5천</option>
                        <option value="1억">자손: 1억</option>
                    </select>

                    <select id="jacha-select" class="premium-select">
                        <option value="1천">자차: 1천</option>
                        <option value="2천">자차: 2천</option>
                        <option value="3천">자차: 3천</option>
                    </select>

                    <div class="premium-checkbox-group">
                        <input type="checkbox" id="rent-cost" class="premium-checkbox">
                        <label for="rent-cost" class="premium-checkbox-label">
                            렌트 <span class="premium-checkbox-note">(대리)</span>
                            <svg class="premium-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" title="렌트비용은 대리운전 보험에만 적용됩니다">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </label>
                    </div>

                    <div class="premium-checkbox-group">
                        <input type="checkbox" id="legal-cost" checked class="premium-checkbox">
                        <label for="legal-cost" class="premium-checkbox-label">법률</label>
                    </div>

                    <button id="calculate-btn" class="premium-calculate-btn">
                        <svg class="premium-play-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span id="calculate-btn-text">산출</span>
                    </button>
                </div>
            </div>

            <!-- 모바일: 카드 형식 -->
            <div id="mobile-results" class="premium-mobile-results">
                ${ageGroups.map(age => `
                    <div class="premium-mobile-card">
                        <div class="premium-mobile-card-header">
                            <div class="premium-mobile-card-title">${age.label}</div>
                            <div class="premium-mobile-card-range">${age.range}</div>
                        </div>
                        <div class="premium-mobile-card-body">
                            <div class="premium-mobile-card-row">
                                <span class="premium-mobile-card-label">대리</span>
                                <span class="premium-mobile-card-value" data-age="${age.ageGroup}" data-type="대리">-</span>
                            </div>
                            <div class="premium-mobile-card-row">
                                <span class="premium-mobile-card-label">일반탁송</span>
                                <span class="premium-mobile-card-value" data-age="${age.ageGroup}" data-type="탁송">-</span>
                            </div>
                            <div class="premium-mobile-card-row">
                                <span class="premium-mobile-card-label">확대탁송</span>
                                <span class="premium-mobile-card-value" data-age="${age.ageGroup}" data-type="확대탁송">-</span>
                            </div>
                            <div class="premium-mobile-card-row">
                                <span class="premium-mobile-card-label">대리+탁송</span>
                                <span class="premium-mobile-card-value" data-age="${age.ageGroup}" data-type="대리+탁송">-</span>
                            </div>
                            <div class="premium-mobile-card-row">
                                <span class="premium-mobile-card-label">대리+확대</span>
                                <span class="premium-mobile-card-value" data-age="${age.ageGroup}" data-type="대리+확대">-</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- 데스크톱: 테이블 형식 -->
            <div id="desktop-results" class="premium-desktop-results">
                <table class="premium-table">
                    <thead>
                        <tr>
                            <th class="premium-table-th-year">년령</th>
                            <th>대리</th>
                            <th>일반탁송</th>
                            <th>확대탁송</th>
                            <th>대리+탁송</th>
                            <th>대리+확대</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ageGroups.map(age => `
                            <tr>
                                <td class="premium-table-td-year">
                                    <div class="premium-table-year-content">
                                        <span class="premium-table-year-label">${age.label}</span>
                                        <span class="premium-table-year-range">${age.range}</span>
                                    </div>
                                </td>
                                <td class="premium-table-td-value" data-age="${age.ageGroup}" data-type="대리">-</td>
                                <td class="premium-table-td-value" data-age="${age.ageGroup}" data-type="탁송">-</td>
                                <td class="premium-table-td-value" data-age="${age.ageGroup}" data-type="확대탁송">-</td>
                                <td class="premium-table-td-value" data-age="${age.ageGroup}" data-type="대리+탁송">-</td>
                                <td class="premium-table-td-value" data-age="${age.ageGroup}" data-type="대리+확대">-</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Footer Notes -->
            <div class="premium-footer-notes">
                <ul class="premium-footer-notes-list">
                    <li>
                        <span class="premium-footer-bullet">•</span>
                        <span>상기 보험료는 DB손해보험 개인대리운전 보험료 입니다</span>
                    </li>
                    <li>
                        <span class="premium-footer-bullet">•</span>
                        <span>보험료 계산식: (대인+대물+자손+자차+렌트+법률) 일시납 기준에 10회 납 적용(×1.02)하여 표시</span>
                    </li>
                    <li>
                        <span class="premium-footer-bullet">•</span>
                        <span>렌트비용은 대리운전 보험에만 적용되며, 탁송/확대탁송에는 적용되지 않습니다</span>
                    </li>
                    <li>
                        <span class="premium-footer-bullet">•</span>
                        <span>책임초과무한 = 대인2, 책임포함무한 = 대인2 + 대인1특약</span>
                    </li>
                    <li>
                        <span class="premium-footer-bullet">•</span>
                        <span>만 26세이하는 가입을 할 수 없습니다</span>
                    </li>
                    <li class="premium-footer-note-accent">
                        <span class="premium-footer-bullet-accent">•</span>
                        <span>더 자세한 상담을 원하시면 상담 신청하시면 바로 연락드리겠습니다</span>
                    </li>
                    <li class="premium-footer-note-accent">
                        <span class="premium-footer-bullet-accent">•</span>
                        <span>상담신청하시면 신청하신분과 당사 담당자에게 문자가 갑니다</span>
                    </li>
                    <li>
                        <span class="premium-footer-bullet">•</span>
                        <span>당사 담당자가 바로 전화 드릴 것 입니다</span>
                    </li>
                </ul>
            </div>
        </div>
    `;

    // 이벤트 리스너 및 기본값 반영
    const daeinSelect = document.getElementById('daein-select');
    const daemulSelect = document.getElementById('daemul-select');
    const jasonSelect = document.getElementById('jason-select');
    const jachaSelect = document.getElementById('jacha-select');
    const rentCostCheck = document.getElementById('rent-cost');
    const legalCostCheck = document.getElementById('legal-cost');
    const calculateBtn = document.getElementById('calculate-btn');
    if (daeinSelect) daeinSelect.value = daein;
    if (daemulSelect) daemulSelect.value = daemul;
    if (jasonSelect) jasonSelect.value = jason;
    if (jachaSelect) jachaSelect.value = jacha;
    if (rentCostCheck) rentCostCheck.checked = rentCost;
    if (legalCostCheck) legalCostCheck.checked = legalCost;

    /** 담보 변경 시 변수 갱신 + 이미 산출된 상태면 결과만 다시 계산 */
    const onCoverageChange = (update) => {
        update();
        if (calculated && premiumData.length > 0) updateResults();
    };
    if (daeinSelect) daeinSelect.addEventListener('change', (e) => onCoverageChange(() => { daein = e.target.value; }));
    if (daemulSelect) daemulSelect.addEventListener('change', (e) => onCoverageChange(() => { daemul = e.target.value; }));
    if (jasonSelect) jasonSelect.addEventListener('change', (e) => onCoverageChange(() => { jason = e.target.value; }));
    if (jachaSelect) jachaSelect.addEventListener('change', (e) => onCoverageChange(() => { jacha = e.target.value; }));
    if (rentCostCheck) rentCostCheck.addEventListener('change', (e) => onCoverageChange(() => { rentCost = e.target.checked; }));
    if (legalCostCheck) legalCostCheck.addEventListener('change', (e) => onCoverageChange(() => { legalCost = e.target.checked; }));
    if (calculateBtn) calculateBtn.addEventListener('click', handleCalculate);
}

/**
 * 산출 버튼 클릭 핸들러
 */
async function handleCalculate() {
    const calculateBtn = document.getElementById('calculate-btn');
    const calculateBtnText = document.getElementById('calculate-btn-text');
    
    // fetchPremiumRates 함수가 전역 스코프에 있는지 확인
    if (typeof fetchPremiumRates !== 'function') {
        alert('보험료 데이터를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.');
        return;
    }
    
    if (premiumData.length === 0) {
        loading = true;
        if (calculateBtn) calculateBtn.disabled = true;
        if (calculateBtnText) calculateBtnText.textContent = '로딩 중...';
        try {
            premiumData = await fetchPremiumRates();
            
            if (!premiumData || premiumData.length === 0) {
                throw new Error('보험료 데이터가 비어있습니다');
            }
            
            calculated = true;
            updateResults();
        } catch (error) {
            alert('보험료 데이터를 불러오는데 실패했습니다: ' + error.message);
        } finally {
            loading = false;
            if (calculateBtn) calculateBtn.disabled = false;
            if (calculateBtnText) calculateBtnText.textContent = '산출';
        }
    } else {
        calculated = true;
        updateResults();
    }
}

/**
 * 결과 업데이트
 */
function updateResults() {
    if (!calculated) {
        return;
    }
    
    if (premiumData.length === 0) {
        return;
    }

    ageGroups.forEach(age => {
        const 대리보험료 = calculatePremiumForTable('대리', age.ageGroup);
        const 탁송보험료 = calculatePremiumForTable('탁송', age.ageGroup);
        const 확대탁송보험료 = calculatePremiumForTable('확대탁송', age.ageGroup);

        // 숫자 타입 확인
        const formatValue = (num) => {
            if (typeof num !== 'number' || isNaN(num)) {
                return '-';
            }
            return num.toLocaleString('ko-KR');
        };

        // 모바일
        const mobileElements = document.querySelectorAll(`[data-age="${age.ageGroup}"]`);
        mobileElements.forEach(el => {
            const type = el.getAttribute('data-type');
            let value = '-';
            if (type === '대리') value = formatValue(대리보험료);
            else if (type === '탁송') value = formatValue(탁송보험료);
            else if (type === '확대탁송') value = formatValue(확대탁송보험료);
            else if (type === '대리+탁송') value = formatValue(대리보험료 + 탁송보험료);
            else if (type === '대리+확대') value = formatValue(대리보험료 + 확대탁송보험료);
            el.textContent = value;
        });

        // 데스크톱
        const desktopElements = document.querySelectorAll(`td[data-age="${age.ageGroup}"]`);
        desktopElements.forEach(el => {
            const type = el.getAttribute('data-type');
            let value = '-';
            if (type === '대리') value = formatValue(대리보험료);
            else if (type === '탁송') value = formatValue(탁송보험료);
            else if (type === '확대탁송') value = formatValue(확대탁송보험료);
            else if (type === '대리+탁송') value = formatValue(대리보험료 + 탁송보험료);
            else if (type === '대리+확대') value = formatValue(대리보험료 + 확대탁송보험료);
            el.textContent = value;
        });
    });
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPremiumCalculator);
} else {
    renderPremiumCalculator();
}
